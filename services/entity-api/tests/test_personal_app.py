"""Focused tests for ENTITY personal app message isolation and reply lifecycle."""
import sqlite3
from fastapi import HTTPException
from app.office.personal_app import setup, timestamp

def test_personal_message_schema_and_isolation():
    db=sqlite3.connect(":memory:")
    db.row_factory=sqlite3.Row
    setup(db)
    db.execute("INSERT INTO office_personal_messages VALUES(?,?,?,?,?,?,?,?,?,?)",
        ("m1","office","carlos","Daniel","16:00","Entity meeting","pending",None,timestamp(),None))
    db.execute("INSERT INTO office_personal_messages VALUES(?,?,?,?,?,?,?,?,?,?)",
        ("m2","other","carlos","Daniel","16:00","Other meeting","pending",None,timestamp(),None))
    db.execute("INSERT INTO office_personal_messages VALUES(?,?,?,?,?,?,?,?,?,?)",
        ("m3","office","juana","Daniel","16:00","Another meeting","pending",None,timestamp(),None))
    rows=db.execute("SELECT id FROM office_personal_messages WHERE site=? AND recipient=?",("office","carlos")).fetchall()
    assert [row["id"] for row in rows]==["m1"]
    db.execute("UPDATE office_personal_messages SET status=?,response=?,responded_at=? WHERE id=?",
               ("answered","ready",timestamp(),"m1"))
    assert db.execute("SELECT response FROM office_personal_messages WHERE id='m1'").fetchone()[0]=="ready"


import unittest
class PersonalStorageTests(unittest.TestCase):
    def test_storage_isolation_and_reply(self):
        test_personal_message_schema_and_isolation()
