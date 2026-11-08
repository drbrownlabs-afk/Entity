import unittest,json
from uuid import uuid4
import test_office as base
from test_office import PASSWORD
from app import main
from app.office.auth import create_account
class ResourceScopeTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    cmd=base.OfficeTests.cmd
    state=base.OfficeTests.state
    def operator(self,granted=True):
        with main.database(write=True) as db:
            create_account(db,'jose',PASSWORD,'office','operator','technician')
            if granted:
                for permission in ['read','write']:
                    db.execute('INSERT INTO office_grants VALUES(?,?,?,?)',('office','jose','zone',permission))
                db.execute('INSERT INTO office_grants VALUES(?,?,?,?)',('office','jose','luis','read'))
        return self.auth('jose')
    def test_assigned_operator_cannot_escape_via_queries_actions_or_capabilities(self):
        headers=self.operator()
        visible=self.client.get(self.root+'/world',headers=headers).json()['entities']
        self.assertIn('desk',visible);self.assertNotIn('camera',visible);self.assertNotIn('carlos',visible);self.assertNotIn('other-zone',visible)
        self.cmd('zone.close','zone',headers=headers)
        self.cmd('zone.close','other-zone',headers=headers,code=403)
        self.assertEqual(self.client.post(self.root+'/queries',headers=headers,json={'kind':'entity','entity_id':'camera'}).status_code,403)
        self.assertEqual(self.client.post(self.root+'/queries',headers=headers,json={'kind':'graph','entity_id':'carlos'}).status_code,403)
        caps=self.client.get('/v1/sites/office/capabilities',headers=headers).json()
        self.assertFalse(any(c['resource_id'] in ['camera','other-zone','carlos'] for c in caps))
        events=self.client.get(self.root+'/events',headers=headers).json()
        self.assertTrue(all('payload' not in e for e in events))
        fork=self.client.post(self.root+'/scenarios',headers=headers,json={'id':'jose-scenario','expected_revision':self.state()['revision']})
        self.assertEqual(fork.status_code,201,fork.text);self.assertNotIn('camera',fork.json()['entities'])
        self.client.post(self.root+'/scenarios',headers=self.headers,json={'id':'admin-private','expected_revision':self.state()['revision']})
        self.assertEqual(self.client.get(self.root+'/scenarios/admin-private/comparison',headers=headers).status_code,403)
    def test_operator_without_resource_assignment_has_no_implicit_camera_access(self):
        headers=self.operator(False)
        self.assertNotIn('camera',self.client.get(self.root+'/world',headers=headers).json()['entities'])
        self.cmd('zone.close','zone',headers=headers,code=403)
