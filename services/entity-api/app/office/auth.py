"""Opaque server-side sessions, standard PBKDF2 and site-scoped roles; no browser grants."""
import hashlib
import hmac
import json
import secrets
from datetime import datetime,timedelta,timezone
from fastapi import Header,HTTPException

ROLES={
 'admin':{'read','manage','book','receive','access','operate','simulate','query','observe'},
 'reception':{'read','book','receive','access','query'},
 'security':{'read','access','receive','query'},
 'maintenance':{'read','operate','query'},
 'member':{'read','book','query'},
 'viewer':{'read','query'},
 'connector':{'observe'},
}

def digest(password,salt):return hashlib.pbkdf2_hmac('sha256',password.encode(),bytes.fromhex(salt),600000).hex()
def create_account(db,username,password,site,role,person=None):
    if role not in ROLES or len(password)<12:raise HTTPException(422,'Known role and password of at least 12 characters required')
    salt=secrets.token_hex(16)
    db.execute('INSERT INTO office_accounts(username,password_hash,salt,site,role,person) VALUES(?,?,?,?,?,?)',(username,digest(password,salt),salt,site,role,person))

def login(db,username,password):
    row=db.execute('SELECT * FROM office_accounts WHERE username=? AND enabled=1',(username,)).fetchone()
    if not row or not hmac.compare_digest(digest(password,row['salt']),row['password_hash']):raise HTTPException(401,'Invalid credentials')
    token=secrets.token_urlsafe(32);expires=(datetime.now(timezone.utc)+timedelta(hours=8)).isoformat()
    db.execute('INSERT INTO office_sessions VALUES(?,?,?)',(hashlib.sha256(token.encode()).hexdigest(),username,expires))
    return {'token':token,'expires_at':expires,'actor':username,'site_id':row['site'],'role':row['role'],'person_id':row['person']}

def authenticate(authorization):
    from app.main import database
    token=authorization[7:] if authorization and authorization.startswith('Bearer ') else ''
    if not token or not token.isascii():raise HTTPException(401,'Bearer required')
    with database() as db:
        row=db.execute('SELECT a.*,s.expires_at FROM office_sessions s JOIN office_accounts a ON a.username=s.username WHERE s.token_hash=? AND a.enabled=1',(hashlib.sha256(token.encode()).hexdigest(),)).fetchone()
    if not row or row['expires_at']<=datetime.now(timezone.utc).isoformat():raise HTTPException(401,'Session missing or expired')
    return {'actor':row['username'],'site':row['site'],'role':row['role'],'person':row['person'],'permissions':ROLES[row['role']]}

def scoped(site,actor,permission):
    if actor['site']!=site:raise HTTPException(403,'Site scope denied')
    if permission not in actor['permissions']:raise HTTPException(403,'Permission denied')


def principal(authorization:str|None=Header(default=None)):return authenticate(authorization)
