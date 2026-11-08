import json,unittest,os
from unittest.mock import patch
from types import SimpleNamespace
from uuid import uuid4
import test_office as base
from app.office.agent import OfficeOpenAIProvider
from openai import OpenAI
import httpx

class OfficeAgentTests(unittest.TestCase):
    setUp=base.OfficeTests.setUp
    tearDown=base.OfficeTests.tearDown
    auth=base.OfficeTests.auth
    cmd=base.OfficeTests.cmd
    state=base.OfficeTests.state
    def ask(self,body,headers=None):
        return self.client.post(self.root+'/agent/requests',headers=headers or self.headers,json={'id':str(uuid4()),'question':'¿Dónde está Luis y cuál es la evidencia?',**body})
    def test_guided_facts_trace_permission_and_action(self):
        response=self.ask({'query':{'kind':'location','entity_id':'luis'}})
        self.assertEqual(response.status_code,200,response.text);result=response.json()
        self.assertEqual(result['result']['result']['status'],'unknown');self.assertTrue(result['evidence'])
        self.assertFalse(result['model_prose_used_as_fact'])
        trace=self.client.get(self.root+'/agent/requests/'+result['request_id'],headers=self.headers).json()
        self.assertEqual(trace,result)
        self.assertEqual(self.client.get(self.root+'/agent/requests/'+result['request_id'],headers=self.auth('luis')).status_code,403)
        denied=self.ask({'query':{'kind':'entity','entity_id':'camera'}},self.auth('luis')).json()
        self.assertEqual(denied['status'],'permission_denied');self.assertIsNone(denied['result'])
        action=self.ask({'approved_command':{'operation':'zone.close','target':'zone','inputs':{}}})
        self.assertEqual(action.json()['status'],'verified');self.assertTrue(self.state()['entities']['zone']['closed'])
        denied=self.ask({'approved_command':{'operation':'zone.open','target':'zone','inputs':{}}},self.auth('luis')).json()
        self.assertEqual(denied['status'],'permission_denied')
    def test_official_sdk_tool_and_no_silent_real_provider_fallback(self):
        def handler(request):
            body=json.loads(request.content);self.assertEqual(body['tools'][0]['function']['name'],'office_query')
            return httpx.Response(200,json={'id':'test','object':'chat.completion','created':0,'model':'test','choices':[{'index':0,'finish_reason':'tool_calls','message':{'role':'assistant','tool_calls':[{'id':'call','type':'function','function':{'name':'office_query','arguments':'{"kind":"location","entity_id":"luis"}'}}]}}]})
        provider=OfficeOpenAIProvider(client=OpenAI(api_key='unit-test-only',http_client=httpx.Client(transport=httpx.MockTransport(handler))))
        with patch('app.office.agent.OfficeOpenAIProvider',return_value=provider):
            result=self.ask({}).json();self.assertEqual(result['status'],'verified');self.assertEqual(result['provider'],'openai')
        with patch.dict(os.environ,{},clear=True):
            result=self.ask({}).json();self.assertEqual(result['status'],'provider_unavailable');self.assertIsNone(result['result'])
        with patch('app.office.agent.OfficeOpenAIProvider.propose',side_effect=TimeoutError),patch.dict(os.environ,{'ENTITY_LLM_API_KEY':'unit-test-only'}):
            result=self.ask({}).json();self.assertEqual(result['status'],'timed_out')
