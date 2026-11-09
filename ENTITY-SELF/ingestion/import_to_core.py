#!/usr/bin/env python3
"""Load ENTITY-SELF into the existing P1 Core HTTP API. No parallel Core."""
import argparse
import json
import os
import pathlib
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
ENTITIES = ROOT / "entities" / "entities.json"
RELATIONS = ROOT / "entities" / "relations.json"

def request(base, method, path, payload=None, token=None):
    data = json.dumps(payload, ensure_ascii=False).encode() if payload is not None else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    req = urllib.request.Request(base.rstrip("/") + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return 404, None
        if e.code == 409:
            return 409, None
        raise

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=os.environ.get("ENTITY_CORE_URL", "http://127.0.0.1:8000"))
    parser.add_argument("--apply", action="store_true", help="Write to the existing Core; without this, validate and report only")
    args = parser.parse_args()
    entities = json.loads(ENTITIES.read_text(encoding="utf-8"))["entities"]
    relations = json.loads(RELATIONS.read_text(encoding="utf-8"))["relations"]
    ids = {x["id"] for x in entities}
    if len(ids) != len(entities):
        raise SystemExit("Duplicate entity IDs")
    for edge in relations:
        if edge["source_id"] not in ids or edge["target_id"] not in ids:
            raise SystemExit("Relation references unknown entity: " + edge["id"])
    print(f"Validated: {len(entities)} entities, {len(relations)} relations")
    if not args.apply:
        print("No writes. Run with --apply against a reachable P1 Core.")
        return
    token = os.environ.get("ENTITY_CORE_TOKEN")
    status, _ = request(args.url, "GET", "/ready", token=token)
    if status != 200:
        raise SystemExit("P1 Core not ready")
    created = existing = linked = skipped = 0
    for entity in entities:
        path = "/v1/entities/" + entity["id"]
        status, current = request(args.url, "GET", path, token=token)
        if status == 200:
            if current["type"] != entity["type"]:
                raise SystemExit("Conflicting type for " + entity["id"])
            # Do not overwrite operational entities; report divergence.
            if current["attributes"] != entity["attributes"]:
                print("Existing attributes differ; preserved:", entity["id"])
            existing += 1
        else:
            status, _ = request(args.url, "POST", "/v1/entities", entity, token=token)
            if status not in (201, 409):
                raise SystemExit("Entity creation failed: " + entity["id"])
            created += status == 201
    # API relation POST does not offer a client ID or unique constraint.
    # Read each source graph and skip existing (source, type, target) triples.
    by_source = {}
    for edge in relations:
        by_source.setdefault(edge["source_id"], []).append(edge)
    for source, edges in by_source.items():
        _, current = request(args.url, "GET", "/v1/entities/" + source, token=token)
        seen = {(x["source_id"], x["type"], x["target_id"]) for x in current["relations"]}
        for edge in edges:
            triple = (edge["source_id"], edge["type"], edge["target_id"])
            if triple in seen:
                skipped += 1
                continue
            status, _ = request(args.url, "POST", "/v1/relations",
                                {key: edge[key] for key in ("source_id", "target_id", "type")}, token=token)
            if status != 201:
                raise SystemExit("Relation creation failed: " + edge["id"])
            linked += 1
            seen.add(triple)
    print(f"Imported: {created} new entities, {existing} existing, {linked} new relations, {skipped} existing relations")

if __name__ == "__main__":
    main()
