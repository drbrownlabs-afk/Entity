"""Incremental hypotheses over already available, source-local evidence.

Reuses the frozen appearance/geodesic gates. Unlike batch association, every
decision has its own knowledge time and alias/revision; past events are detached.
Bounded histories constrain compute, not identity lifetime. Silence is unknown.
"""
import copy
import hashlib
import itertools
from collections import deque
from datetime import datetime
import numpy as np
from .cctv_mtmc import POLICY, pair_evidence, region_transition


def timestamp(value):
    result=datetime.fromisoformat(value.replace('Z','+00:00'))
    if result.tzinfo is None:raise ValueError('Timezone-aware evidence time required')
    return result


class CausalMTMC:
    def __init__(self,graph,run,policy=None,history_size=32):
        self.graph=graph;self.run=run;self.policy=POLICY|{'sync_tolerance_seconds':.25}|dict(policy or {});self.limit=history_size
        if history_size<3:raise ValueError('At least three evidence samples required')
        self.histories={};self.tentative={};self.members={};self.groups={};self.owner={};self.edges={}
        self.conflicts=set();self.counter=0;self.last_known=None

    def _emit(self,gid,known_at,reason,supersedes=(),witness_pair=()):
        group=self.groups[gid];expected=group['revision'];group['revision']+=1
        members=[]
        for key in sorted(group['members']):
            state=self.members[key]
            refs=[state['first_reference'],*list(state['references'])[-3:]]
            if key in witness_pair:refs.extend(x['observation_id'] for x in self.histories[key])
            members.append({'source_id':key[0],'stream_session_id':key[1],'local_track_id':key[2],
                            'evidence_observation_ids':list(dict.fromkeys(refs))})
        return copy.deepcopy({'global_track_id':gid,'expected_revision':expected,
            'status':group['status'],'members':members,'supersedes':list(supersedes),
            'known_at':known_at,'reason':reason,'execution_mode':'causal-incremental',
            'position_status':'unknown','civil_identity_verified':False})

    def update(self,row):
        allowed={'camera_id','stream_session_id','local_track_id','media_time_seconds','frame_index',
                 'observed_at','known_at','frame_sha256','observation_id','embedding','floor_estimate_native',
                 'candidate_floor_cells','track_status','association_confirmation_evidence_at'}
        if set(row)-allowed or not (allowed-{'association_confirmation_evidence_at'})<=row.keys():
            raise ValueError('Unexpected or missing evidence fields')
        known=timestamp(row['known_at']);observed=timestamp(row['observed_at'])
        if observed>known or (self.last_known is not None and known<self.last_known):
            raise ValueError('Evidence availability cannot rewind')
        if row.get('association_confirmation_evidence_at') and timestamp(row['association_confirmation_evidence_at'])>known:
            raise ValueError('Future local confirmation')
        if row['camera_id'] not in self.graph.sensors or not row['local_track_id'].startswith(row['camera_id']+':'):
            raise ValueError('Invalid sensor-local provenance')
        if row['track_status'] not in {'candidate','confirmed'} or (row['track_status']=='confirmed' and not row.get('association_confirmation_evidence_at')):
            raise ValueError('Missing confirmation evidence')
        if len(row['embedding'])!=512 or not np.isfinite(row['embedding']).all() or np.linalg.norm(row['embedding'])<1e-9:
            raise ValueError('Invalid appearance descriptor')
        media=row['media_time_seconds']
        if not np.isfinite(media) or media<0:raise ValueError('Invalid source media time')
        key=(row['camera_id'],row['stream_session_id'],row['local_track_id'])
        if key in self.members and (row['frame_index']<=self.members[key]['frame_index'] or media<=self.members[key]['media_time_seconds']):
            raise ValueError('Duplicate/late evidence must not rewind association')
        events=[];self.last_known=known
        if key not in self.members:
            self.counter+=1;anchor='|'.join(map(str,(*key,row['frame_sha256'],row['observed_at'])))
            gid=self.run+':visual-'+hashlib.sha256(anchor.encode()).hexdigest()[:20]
            self.groups[gid]={'members':{key},'status':'candidate','revision':0,'order':self.counter}
            self.owner[key]=gid;self.histories[key]=deque(maxlen=self.limit)
            self.tentative[key]=deque(maxlen=4)
            self.members[key]={'references':deque(maxlen=4),'first_reference':row['observation_id']}
        member=self.members[key];member.update(frame_index=row['frame_index'],media_time_seconds=media)
        member['references'].append(row['observation_id'])
        gid=self.owner[key]
        if self.groups[gid]['revision']==0:events.append(self._emit(gid,row['known_at'],'First camera-local visual candidate'))
        # Tentative observations are still visible in Core, but never supply a
        # confirmed cross-camera association sample.
        if row['track_status']!='confirmed':
            self.tentative[key].append(copy.deepcopy(row));return events
        # A new confirmation can now support earlier tentative detections. This
        # is knowledge acquired now: original candidate events remain immutable.
        while self.tentative[key]:
            prior=self.tentative[key].popleft()
            prior['known_at']=row['known_at']
            prior['association_confirmation_evidence_at']=row['association_confirmation_evidence_at']
            self.histories[key].append(prior)
        if self.histories[key]:
            previous=self.histories[key][-1]
            check=region_transition(self.graph,previous['floor_estimate_native'],row['floor_estimate_native'],
                media-previous['media_time_seconds'],self.policy,previous['candidate_floor_cells'],row['candidate_floor_cells'])
            if not check['possible'] and check['reason']!='outside calibrated walkable cells' and self.groups[gid]['status']!='uncertain':
                self.groups[gid]['status']='uncertain'
                events.append(self._emit(gid,row['known_at'],'Successive local image supports contradict static travel constraints'))
        self.histories[key].append(copy.deepcopy(row))
        for other,history in self.histories.items():
            if other==key or not history:continue
            pair=tuple(sorted((key,other)))
            edge=pair_evidence(list(self.histories[pair[0]]),list(self.histories[pair[1]]),self.graph,self.policy)
            self.edges[pair]=edge
            if edge['conflict']:self.conflicts.add(pair)
        # A later contradiction revises an existing component explicitly. It is
        # held uncertain rather than silently splitting/renaming historical IDs.
        for pair in self.conflicts:
            a,b=pair
            if self.owner[a]==self.owner[b]:
                old=self.owner[a];group=self.groups[old]
                if group['status']!='uncertain':
                    group['status']='uncertain';events.append(self._emit(old,row['known_at'],'New evidence contradicts an established component',witness_pair=pair))
        candidates=[]
        for pair,edge in self.edges.items():
            a,b=pair;ga,gb=self.owner[a],self.owner[b]
            if ga==gb or not edge.get('accepted_candidate') or pair in self.conflicts:continue
            if self.groups[ga]['status']=='uncertain' or self.groups[gb]['status']=='uncertain':continue
            candidates.append((edge['score'],ga,gb,pair))
        candidates.sort(reverse=True)
        for score,ga,gb,pair in candidates:
            # Earlier merges may have subsumed one endpoint in this update.
            if self.groups[ga].get('alias_of') or self.groups[gb].get('alias_of'):continue
            left=self.groups[ga]['members'];right=self.groups[gb]['members']
            if any(tuple(sorted((a,b))) in self.conflicts for a,b in itertools.product(left,right)):continue
            ambiguous=False
            for other_score,x,y,_ in candidates:
                if abs(other_score-score)>self.policy['ambiguous_score_margin']:continue
                alternative=({x,y}-{ga,gb})
                if not alternative or not ({x,y}&{ga,gb}):continue
                for alt in alternative:
                    if any(tuple(sorted((a,b))) in self.conflicts for a,b in itertools.product(left|right,self.groups[alt]['members']) if a!=b):ambiguous=True
            if ambiguous:continue
            keep,alias=sorted((ga,gb),key=lambda g:self.groups[g]['order'])
            group=self.groups[keep];group['members']|=self.groups[alias]['members'];group['status']='corroborated'
            self.groups[alias]['alias_of']=keep
            for local in group['members']:self.owner[local]=keep
            events.append(self._emit(keep,row['known_at'],'Available appearance and static graph support a provisional merge',[alias],pair))
        return events
