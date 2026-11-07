"""ENTITY personal inbox: authenticated, site-scoped demo bridge.

A real user can respond to a simulated visitor; this is NOT a push service.
"""
import json
from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.office.auth import principal, scoped

router = APIRouter(prefix="/v1/office/app", tags=["personal-app"])

def timestamp():
    return datetime.now(timezone.utc).isoformat()

def setup(db):
    db.execute("""CREATE TABLE IF NOT EXISTS office_personal_messages (
        id TEXT PRIMARY KEY, site TEXT NOT NULL, recipient TEXT NOT NULL,
        visitor TEXT NOT NULL, meeting_at TEXT NOT NULL, meeting_title TEXT NOT NULL,
        status TEXT NOT NULL, response TEXT, created_at TEXT NOT NULL,
        responded_at TEXT
    )""")
    db.execute("""CREATE TABLE IF NOT EXISTS office_personal_links(
        message_id TEXT PRIMARY KEY,site TEXT NOT NULL,run TEXT NOT NULL,conversation TEXT NOT NULL,terminal TEXT NOT NULL)""")
    db.execute("""CREATE INDEX IF NOT EXISTS idx_personal_messages_inbox
        ON office_personal_messages(site,recipient,created_at)""")

class DemoArrival(BaseModel):
    recipient: str = Field(min_length=1, max_length=120)
    visitor: str = Field(default="Daniel", min_length=1, max_length=120)
    meeting_at: str = Field(default="16:00", min_length=1, max_length=40)
    meeting_title: str = Field(default="Reunión con Entity", max_length=200)

class Reply(BaseModel):
    response: str = Field(pattern="^(ready|five_minutes)$")

@router.get("/me")
def my_app(actor=Depends(principal)):
    return {"actor":actor["actor"],"person_id":actor["person"],"site_id":actor["site"],"role":actor["role"]}

@router.get("/inbox")
def inbox(actor=Depends(principal)):
    from app.main import database
    with database() as db:
        setup(db)
        rows=db.execute("""SELECT * FROM office_personal_messages
            WHERE site=? AND recipient=? ORDER BY created_at DESC LIMIT 100""",
            (actor["site"],actor["actor"])).fetchall()
        return [dict(row) for row in rows]

@router.post("/sites/{site}/demo-arrival", status_code=201)
def demo_arrival(site:str,body:DemoArrival,actor=Depends(principal)):
    from app.main import database
    scoped(site,actor,"simulate")
    with database(write=True) as db:
        setup(db)
        target=db.execute("SELECT username FROM office_accounts WHERE site=? AND username=? AND enabled=1",
                          (site,body.recipient)).fetchone()
        if target is None: raise HTTPException(404,"Recipient account not found in this site")
        message={"id":str(uuid4()),"site":site,"recipient":body.recipient,
                 "visitor":body.visitor,"meeting_at":body.meeting_at,
                 "meeting_title":body.meeting_title,"status":"pending","response":None,
                 "created_at":timestamp(),"responded_at":None}
        db.execute("""INSERT INTO office_personal_messages VALUES(?,?,?,?,?,?,?,?,?,?)""",
                   tuple(message.values()))
    return message

@router.post("/inbox/{message_id}/reply")
def reply(message_id:str,body:Reply,actor=Depends(principal)):
    from app.main import database
    with database(write=True) as db:
        setup(db)
        row=db.execute("SELECT * FROM office_personal_messages WHERE id=? AND site=? AND recipient=?",
                       (message_id,actor["site"],actor["actor"])).fetchone()
        if row is None: raise HTTPException(404,"Message not found")
        if row["status"] not in ["pending","waiting"]: raise HTTPException(409,"Already answered")
        link=db.execute("SELECT * FROM office_personal_links WHERE message_id=? AND site=?",(message_id,actor["site"])).fetchone()
        if link:
            from .service import command
            from .storage import identity,get_run
            response=command(db,actor["site"],link["run"],{**actor,"channel":"personal-web"},{"id":identity("personal-reply",message_id,body.response),"operation":"intercom.reply","target":link["terminal"],
                "inputs":{"conversation_id":link["conversation"],"response":"wait" if body.response=="five_minutes" else "ready","minutes":5}})
            if response["status"]!="verified":raise HTTPException(503,"Communication was not verified")
            when=get_run(db,actor["site"],link["run"])["clock"]
        else:when=timestamp()
        db.execute("""UPDATE office_personal_messages SET status=?,
                      response=?,responded_at=? WHERE id=?""",("waiting" if body.response=="five_minutes" and link else "answered",body.response,when,message_id))
        return {"id":message_id,"status":"waiting" if body.response=="five_minutes" and link else "answered","response":body.response,
                "responded_at":when,"visitor":row["visitor"]}
