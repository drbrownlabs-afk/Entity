from app.office.access import projection, permitted

def test_member_cannot_see_cameras_or_other_people():
    state={"entities":{
      "cam":{"id":"cam","kind":"Camera","stream_url":"secret"},
      "carlos":{"id":"carlos","kind":"Person","name":"Carlos"},
      "jose":{"id":"jose","kind":"Person","name":"Jose"},
      "mine":{"id":"mine","kind":"Booking","person_id":"carlos"},
      "other":{"id":"other","kind":"Booking","person_id":"jose"},
      "lobby":{"id":"lobby","kind":"Reception","name":"Recepcion"}
    }}
    actor={"role":"member","person":"carlos"}
    visible=projection(state,actor)["entities"]
    assert set(visible)=={"carlos","mine","lobby"}
    assert "cam" not in visible and "jose" not in visible

def test_unlinked_member_fails_closed():
    state={"entities":{"cam":{"id":"cam","kind":"Camera"},"lobby":{"id":"lobby","kind":"Reception"}}}
    assert projection(state,{"role":"member","person":None})["entities"]=={}

def test_admin_sees_operational_world():
    state={"entities":{"cam":{"id":"cam","kind":"Camera"}}}
    assert "cam" in projection(state,{"role":"admin","person":"jose"})["entities"]
