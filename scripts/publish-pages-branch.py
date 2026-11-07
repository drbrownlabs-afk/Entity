"""Publish the already-built public demo via existing authorized Git transport."""
from pathlib import Path
import shutil
import subprocess
import tempfile
root=Path(__file__).resolve().parents[1]
if not (root/'apps/web/dist/index.html').exists():raise SystemExit('Build the experience first')
remote=subprocess.check_output(['git','remote','get-url','origin'],cwd=root,text=True).strip()
# Independent deployment repository; never change/reset a development checkout.
with tempfile.TemporaryDirectory(prefix='entity-pages-') as directory:
    target=Path(directory)
    shutil.copytree(root/'apps/web/dist',target,dirs_exist_ok=True)
    (target/'.nojekyll').write_text('')
    subprocess.run(['git','init','--initial-branch=gh-pages'],cwd=target,check=True,stdout=subprocess.DEVNULL)
    subprocess.run(['git','remote','add','origin',remote],cwd=target,check=True)
    existing=subprocess.check_output(['git','ls-remote','origin','refs/heads/gh-pages'],cwd=target,text=True).strip()
    if existing:
        subprocess.run(['git','fetch','--depth=1','origin','gh-pages'],cwd=target,check=True)
        subprocess.run(['git','reset','--mixed','FETCH_HEAD'],cwd=target,check=True)
        # Index previous tracked files so assets removed by this build are removed from the branch.
    subprocess.run(['git','add','--all'],cwd=target,check=True)
    result=subprocess.run(['git','diff','--cached','--quiet'],cwd=target)
    if result.returncode!=0 or not existing:
        subprocess.run(['git','-c','user.name=ENTITY deployment','-c','user.email=deployment@users.noreply.github.com','commit','-m','Publish standalone ENTITY Experience'],cwd=target,check=True)
        subprocess.run(['git','push','origin','HEAD:refs/heads/gh-pages'],cwd=target,check=True)
    print('Static build published to gh-pages; site activation/deployment must still be verified.')
