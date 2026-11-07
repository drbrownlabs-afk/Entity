import json
import os
import unittest
from unittest.mock import patch
from uuid import uuid4
import httpx
from openai import OpenAI
import test_output
from app.agent import OpenAIProvider


class AgentTests(unittest.TestCase):
    def setUp(self):
        test_output.OutputTests.setUp(self)
        entries=json.loads(os.environ['ENTITY_CONNECTOR_TOKENS'])
        for entry in entries:entry['permissions'].append('agent:read')
        os.environ['ENTITY_CONNECTOR_TOKENS']=json.dumps(entries)
        self.provider_env=patch.dict(os.environ,ENTITY_AGENT_PROVIDER='controlled');self.provider_env.start()
    def tearDown(self):
        self.provider_env.stop();test_output.OutputTests.tearDown(self)

    def request(self,action=False):
        body={'request_id':str(uuid4()),'entity_id':'screen','question':'¿Qué ocurre en recepción?'}
        if action:body['action']={'capability_id':self.cap,'scene':'welcome'}
        return body

    def test_grounded_query_memory_and_no_evidence(self):
        body=self.request()
        result=self.client.post('/v1/agent/requests',headers=self.headers,json=body).json()
        self.assertEqual(result['provider'],'controlled-fixture')
        self.assertIn('No hay estado',result['answer'])
        self.client.post('/v1/entities/screen/memories',json={'content':'Reception display, simulated','source':'test'})
        body['request_id']=str(uuid4())
        result=self.client.post('/v1/agent/requests',headers=self.headers,json=body).json()
        self.assertEqual(len(result['references']['memory_ids']),1)
        self.assertEqual(self.client.get('/v1/agent/requests/'+body['request_id'],headers=self.headers).json(),result)
        body['entity_id']='missing';body['request_id']=str(uuid4())
        self.assertEqual(self.client.post('/v1/agent/requests',headers=self.headers,json=body).status_code,404)

    def test_action_permission_idempotency_and_restart(self):
        body=self.request(True)
        self.assertEqual(self.client.post('/v1/agent/requests',headers={'Authorization':'Bearer reader-only'},json=body).status_code,403)
        response=self.client.post('/v1/agent/requests',headers=self.headers,json=body).json()
        self.assertEqual(response['action_result']['status'],'verified')
        self.assertEqual(response['evidence']['state']['display.scene'],'welcome')
        import app.main
        app.main.initialize()
        self.assertEqual(self.client.post('/v1/agent/requests',headers=self.headers,json=body).json(),response)
        body['question']='different'
        self.assertEqual(self.client.post('/v1/agent/requests',headers=self.headers,json=body).status_code,409)

    def test_model_cannot_escalate_or_invent_actions(self):
        class Malicious:
            name='untrusted-test'
            def propose(self,*args):return 'set_scene',{'capability_id':self_cap,'scene':'unauthorized'}
        self_cap=self.cap
        with patch('app.agent.provider',return_value=Malicious()):
            result=self.client.post('/v1/agent/requests',headers=self.headers,json=self.request()).json()
        self.assertEqual(result['status'],'provider_or_policy_error')
        self.assertNotIn('display.scene',self.client.get('/v1/entities/screen').json()['state'])
        class Slow:
            name='timeout-test'
            def propose(self,*args):raise TimeoutError()
        with patch('app.agent.provider',return_value=Slow()):
            result=self.client.post('/v1/agent/requests',headers=self.headers,json=self.request()).json()
        self.assertEqual(result['status'],'timeout')

    def test_official_sdk_tool_call_and_timeout(self):
        def reply(req):
            body=json.loads(req.content)
            self.assertEqual(body['tool_choice'],'required')
            return httpx.Response(200,json={'id':'chatcmpl-test','object':'chat.completion','created':1,'model':'test',
                'choices':[{'index':0,'finish_reason':'tool_calls','message':{'role':'assistant','content':None,
                    'tool_calls':[{'id':'call_test','type':'function','function':{'name':'report_world_state','arguments':json.dumps({'entity_id':'screen'})}}]}}]})
        client=OpenAI(api_key='test-fixture-only',http_client=httpx.Client(transport=httpx.MockTransport(reply)),max_retries=0)
        with patch('app.agent.provider',return_value=OpenAIProvider(client)):
            result=self.client.post('/v1/agent/requests',headers=self.headers,json=self.request()).json()
        self.assertEqual(result['status'],'ok');self.assertEqual(result['provider'],'openai')
        def timeout(req):raise httpx.ReadTimeout('injected timeout',request=req)
        client=OpenAI(api_key='test-fixture-only',http_client=httpx.Client(transport=httpx.MockTransport(timeout)),max_retries=0)
        with patch('app.agent.provider',return_value=OpenAIProvider(client)):
            result=self.client.post('/v1/agent/requests',headers=self.headers,json=self.request()).json()
        self.assertEqual(result['status'],'timeout')

    def test_real_provider_missing_key_fails_closed(self):
        with patch.dict(os.environ,ENTITY_AGENT_PROVIDER='openai',ENTITY_LLM_API_KEY=''):
            response=self.client.post('/v1/agent/requests',headers=self.headers,json=self.request(True)).json()
        self.assertEqual(response['status'],'provider_unavailable')
        self.assertIsNone(response['action_result'])
        self.assertNotIn('display.scene',self.client.get('/v1/entities/screen').json()['state'])

    def test_foreign_scope_trace_and_failed_output(self):
        body=self.request(True);body['entity_id']='camera'
        self.assertEqual(self.client.post('/v1/agent/requests',headers=self.headers,json=body).status_code,403)
        self.client.put('/v1/output/displays/screen',headers=self.headers,json={'behavior':'fail'})
        response=self.client.post('/v1/agent/requests',headers=self.headers,json=self.request(True)).json()
        self.assertEqual(response['status'],'failed')
        self.assertEqual(self.client.get('/v1/agent/requests/'+response['request_id'],headers={'Authorization':'Bearer reader-only'}).status_code,403)
