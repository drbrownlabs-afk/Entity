"""Exercise real HTTP and two separate server processes against one SQLite file."""
import json
import os
from pathlib import Path
import signal
import socket
import subprocess
import sys
import tempfile
import time
import unittest
from urllib.request import build_opener, ProxyHandler, Request


class RestartTests(unittest.TestCase):
    def test_persistence_after_process_restart(self):
        root = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory() as tmp:
            with socket.socket() as sock:
                sock.bind(('127.0.0.1', 0))
                port = sock.getsockname()[1]
            opener = build_opener(ProxyHandler({}))

            def request(path, payload=None, method=None):
                data = json.dumps(payload).encode() if payload is not None else None
                req = Request(f'http://127.0.0.1:{port}{path}', data=data,
                              headers={'Content-Type': 'application/json'}, method=method)
                with opener.open(req, timeout=3) as response:
                    return json.load(response)

            env = dict(os.environ, ENTITY_SQLITE_PATH=str(Path(tmp) / 'nested/db.sqlite3'))
            with open(Path(tmp) / 'server.log', 'w+') as log:
                for iteration in range(2):
                    proc = subprocess.Popen([sys.executable, '-m', 'uvicorn', 'app.main:app',
                                             '--host', '127.0.0.1', '--port', str(port)],
                                            cwd=root, env=env, stdout=log, stderr=log)
                    try:
                        deadline = time.monotonic() + 20
                        while True:
                            if proc.poll() is not None:
                                log.seek(0)
                                self.fail(log.read())
                            try:
                                self.assertEqual(request('/health')['status'], 'ok')
                                break
                            except OSError:
                                if time.monotonic() >= deadline:
                                    self.fail('API did not become healthy')
                                time.sleep(0.1)
                        if iteration == 0:
                            request('/v1/entities', {'id': 'room', 'type': 'Room', 'attributes': {'floor': 2}})
                            request('/v1/entities', {'id': 'floor', 'type': 'Floor'})
                            request('/v1/relations', {'source_id': 'room', 'target_id': 'floor', 'type': 'locatedIn'})
                            for value in (True, False):
                                request('/v1/entities/room/state', {'key': 'occupied', 'value': value}, 'PUT')
                            request('/v1/entities/room/memories', {'content': 'Synthetic note', 'source': 'test'})
                            request('/v1/entities/room/capabilities', {'operation': 'display.show', 'description': 'Show', 'required_permission': 'display:write'})
                            request('/v1/entities/room/events', {'type': 'inspection.completed', 'source': 'test', 'payload': {'simulated': True}})
                            memories = request('/v1/entities/room/memories')
                            capabilities = request('/v1/entities/room/capabilities')
                            before = request('/v1/entities/room')
                            events = request('/v1/entities/room/events')
                        else:
                            self.assertEqual(request('/v1/entities/room'), before)
                            self.assertEqual(request('/v1/entities/room/events'), events)
                            self.assertEqual(len(request('/v1/entities')), 2)
                            self.assertEqual(request('/v1/entities/room/memories'), memories)
                            self.assertEqual(request('/v1/entities/room/capabilities'), capabilities)
                            self.assertEqual(request('/ready')['database_schema_version'], 2)
                    finally:
                        proc.terminate()
                        try:
                            proc.wait(timeout=10)
                        except subprocess.TimeoutExpired:
                            proc.kill()
                            proc.wait(timeout=5)
                    self.assertIn(proc.returncode, (0, -signal.SIGTERM))
