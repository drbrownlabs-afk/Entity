import os
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient
from app import main


class EntityApiTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        main.DB_PATH = Path(self.temp.name) / "test.sqlite3"
        main.initialize()
        self.client = TestClient(main.app)

    def tearDown(self):
        self.temp.cleanup()

    def test_state_event_memory_and_relations(self):
        a = {"id": "room-a", "type": "Room", "attributes": {"floor": 2}}
        b = {"id": "floor-2", "type": "Floor"}
        self.assertEqual(self.client.post("/v1/entities", json=a).status_code, 201)
        self.assertEqual(self.client.post("/v1/entities", json=b).status_code, 201)
        rel = {"source_id": "room-a", "target_id": "floor-2", "type": "locatedIn"}
        self.assertEqual(self.client.post("/v1/relations", json=rel).status_code, 201)
        self.assertEqual(self.client.put("/v1/entities/room-a/state", json={"key": "occupied", "value": True}).status_code, 200)
        self.assertEqual(self.client.put("/v1/entities/room-a/state", json={"key": "occupied", "value": False}).status_code, 200)
        room = self.client.get("/v1/entities/room-a").json()
        self.assertFalse(room["state"]["occupied"])
        self.assertEqual(len(room["relations"]), 1)
        events = self.client.get("/v1/entities/room-a/events").json()
        self.assertEqual([e["payload"]["value"] for e in events], [True, False])
        # Reinitialize to verify durable state and event history.
        main.initialize()
        self.assertEqual(len(self.client.get("/v1/entities/room-a/events").json()), 2)


if __name__ == "__main__":
    unittest.main()
