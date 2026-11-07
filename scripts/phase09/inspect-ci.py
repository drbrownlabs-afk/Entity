"""Read one authorized Actions job log; publish bounded failure diagnostics, never tokens."""
import os,urllib.request,urllib.error,re
from pathlib import Path
job='128495075909'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):return None
request=urllib.request.Request('https://api.github.com/repos/drbrownlabs-afk/Entity/actions/jobs/'+job+'/logs',
    headers={'Authorization':'Bearer '+os.environ['GITHUB_TOKEN'],'Accept':'application/vnd.github+json'})
try:
    response=urllib.request.build_opener(NoRedirect).open(request);body=response.read()
except urllib.error.HTTPError as error:
    if error.code!=302:raise
    target=error.headers['Location']
    if not target.startswith('https://'):raise RuntimeError('Expected HTTPS log redirect')
    body=urllib.request.urlopen(target).read() # no token on storage redirect
text=body.decode('utf8','replace')
text=re.sub(r'\x1b\[[0-9;]*m','',text).replace(os.environ['GITHUB_TOKEN'],'[redacted]')
excerpt='\n'.join(text.splitlines()[-100:])
Path('docs/evidence/phase09/ci-failure-'+job+'.txt').write_text(
    'Actual authorized job log excerpt.\nhttps://github.com/drbrownlabs-afk/Entity/actions/runs/42403148372/job/'+job+'\n\n'+excerpt+'\n')
