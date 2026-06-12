from typing import Dict, Optional, Union

from casparser.types import CASData, NSDLCASData
from pydantic import BaseModel


class CASResponse(BaseModel):
    status: str
    message: str
    cas: Union[CASData, NSDLCASData]
    gains: Optional[Dict] = None
    stats: Optional[Dict] = None


class CASErrorResponse(CASResponse):
    status: str = "error"
    cas: Dict
