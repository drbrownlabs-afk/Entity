"""Core v1 declaration contracts. Connector execution belongs to Phase 02."""
from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator, model_validator
from pydantic_core import PydanticCustomError
import math
from typing import Annotated

NonBlank = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=512)]


class CoreRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")
    schema_version: Literal["1.0"] = "1.0"

    @model_validator(mode="before")
    @classmethod
    def finite_json_numbers(cls, value):
        # Any/dict fields otherwise allow NaN/Infinity to commit before JSONResponse fails.
        pending = [value]
        while pending:
            item = pending.pop()
            if isinstance(item, float) and not math.isfinite(item):
                raise PydanticCustomError("finite_json", "JSON numbers must be finite")
            if isinstance(item, dict):
                pending.extend(item.values())
            elif isinstance(item, (list, tuple)):
                pending.extend(item)
        return value


class EventCreate(CoreRecord):
    type: NonBlank
    payload: dict[str, Any] = Field(default_factory=dict)
    source: NonBlank


    @field_validator("type")
    @classmethod
    def reject_internal_event_types(cls, value):
        if value in {"state.changed", "memory.recorded", "capability.declared", "output.result"}:
            raise ValueError("Event type is reserved for Core operations")
        return value


class MemoryCreate(CoreRecord):
    content: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=10000)]
    source: NonBlank


class CapabilityCreate(CoreRecord):
    operation: NonBlank
    description: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=2000)]
    parameters: dict[str, Any] = Field(default_factory=dict)
    required_permission: NonBlank


class EventRecord(CoreRecord):
    id: str
    entity_id: str
    type: str
    payload: dict[str, Any]
    occurred_at: str
    source: str


class MemoryRecord(MemoryCreate):
    id: str
    entity_id: str
    created_at: str


class MemoryCreated(MemoryRecord):
    event_id: str


class CapabilityRecord(CapabilityCreate):
    id: str
    entity_id: str
    created_at: str


class CapabilityCreated(CapabilityRecord):
    event_id: str
