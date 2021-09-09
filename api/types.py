from datetime import date
from decimal import Decimal
from typing import Dict, Optional
from typing_extensions import TypedDict

from casparser.types import CASParserDataType
from pydantic import BaseModel


class FundType(TypedDict):
    name: str
    isin: str
    type: str


class GainEntryType(TypedDict):
    fy: str
    fund: str
    isin: str
    type: str
    purchase_date: date
    purchase_value: Decimal
    stamp_duty: Decimal
    sale_date: date
    sale_value: Decimal
    stt: Decimal
    units: Decimal
    ltcg: Decimal
    stcg: Decimal
    tax_ltcg: Decimal


class CASResponse(BaseModel):
    status: str
    message: str
    cas: CASParserDataType
    gains: Optional[Dict]
    stats: Optional[Dict]


class CASErrorResponse(CASResponse):
    status: str = "error"
    cas: Dict
