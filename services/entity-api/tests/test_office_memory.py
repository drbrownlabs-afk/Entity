"""Temporal memory filters must use past relationships, not a person's current zone."""
import unittest
from app import main
import test_office as base

class MemoryTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    cmd=base.OfficeTests.cmd
    advance=base.OfficeTests.advance
    def test_event_zone_filter_preserves_past_location_and_pagination(self):
        self.cmd('entity.upsert',inputs={'id':'luis','kind':'Person','attributes':{'zone_id':'zone'}})
        self.advance('2026-11-07T16:00:00-05:00')
        self.cmd('entity.upsert',inputs={'id':'luis','kind':'Person','attributes':{'zone_id':'other-zone'}})
        endpoint=self.root+'/events';params={'entity_id':'luis','event_type':'entity.upsert','zone_id':'zone'}
        old=self.client.get(endpoint,headers=self.headers,params=params);self.assertEqual(old.status_code,200,old.text)
        self.assertEqual(len(old.json()),1)
        self.assertEqual(old.json()[0]['payload']['changes']['luis']['zone_id'],'zone')
        new=self.client.get(endpoint,headers=self.headers,params={**params,'zone_id':'other-zone'}).json()
        self.assertEqual(len(new),1);self.assertGreater(new[0]['seq'],old.json()[0]['seq'])
        later=self.client.get(endpoint,headers=self.headers,params={'after':old.json()[0]['seq'],'entity_id':'luis','event_type':'entity.upsert','limit':1}).json()
        self.assertEqual(later,new)
        self.assertEqual(self.client.get(endpoint,headers=self.headers,params={'start':'2026-11-07T16:00:00-05:00','end':'2026-11-07T15:00:00-05:00'}).status_code,422)
    def test_filters_never_grant_other_site_or_private_resource_access(self):
        endpoint=self.root+'/events'
        self.assertEqual(self.client.get(endpoint,headers=self.auth('outsider'),params={'zone_id':'zone'}).status_code,403)
        response=self.client.get(endpoint,headers=self.auth('luis'),params={'entity_id':'camera'})
        self.assertEqual(response.status_code,403,response.text)
        self.assertEqual(self.client.get(endpoint,headers=self.headers,params={'start':'not-a-time'}).status_code,422)
        self.assertEqual(self.client.get(endpoint,headers=self.headers,params={'after':-1}).status_code,422)
