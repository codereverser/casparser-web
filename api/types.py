from datetime import date
from decimal import Decimal
from typing import Dict, Optional
from typing_extensions import TypedDict

from casparser.types import CASData
from pydantic import BaseModel


class CASResponse(BaseModel):
    status: str
    message: str
    cas: CASData
    gains: Optional[Dict]
    stats: Optional[Dict]


class CASErrorResponse(CASResponse):
    status: str = "error"
    cas: Dict
