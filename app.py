import asyncio
from datetime import date
from decimal import Decimal
import itertools
from typing import Dict, List, Optional
from typing_extensions import TypedDict

from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.responses import JSONResponse, PlainTextResponse
from mangum import Mangum
from pydantic import BaseModel

from casparser import read_cas_pdf, CapitalGainsReport
from casparser.analysis.gains import Fund
from casparser.exceptions import IncompleteCASError
from casparser.types import CASParserDataType


class FundType(TypedDict):
    name: str
    isin: str
    type: str


class GainEntryType(TypedDict):
    fy: str
    fund: str
    isin: str
    type: str
    buy_date: date
    buy_price: Decimal
    stamp_duty: Decimal
    sell_date: date
    sell_price: Decimal
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


class CASErrorResponse(CASResponse):
    status: str = "error"
    cas: Dict


app = FastAPI()


@app.get(
    "/ping", response_class=PlainTextResponse, summary="API health check / keep-warm"
)
def ping():
    return PlainTextResponse("pong")


def prepare_gains(cg: Optional[CapitalGainsReport]):
    if cg is None:
        return None
    summary = {}
    fy: str
    fund: Fund
    for (fy, fund), txns in itertools.groupby(cg.gains, key=lambda x: (x.fy, x.fund)):
        if fy not in summary:
            summary[fy] = {
                "funds": [],
                "total": {
                    "ltcg": 0,
                    "stcg": 0,
                    "tax_ltcg": 0,
                },
            }
        net_total = summary[fy]["total"]
        total = {
            "ltcg": 0,
            "stcg": 0,
            "tax_ltcg": 0,
        }
        data = {"fy": fy, "fund": fund, "txns": []}
        for txn in txns:
            total["ltcg"] += txn.ltcg
            total["stcg"] += txn.stcg
            total["tax_ltcg"] += txn.ltcg_taxable
            data["txns"].append(
                {
                    "buy_date": txn.buy_date,
                    "buy_price": txn.buy_price,
                    "units": txn.units,
                    "coa": txn.coa,
                    "sell_date": txn.sell_date,
                    "sell_price": txn.sell_price,
                    "ltcg": txn.ltcg,
                    "stcg": txn.stcg,
                    "tax_ltcg": txn.ltcg_taxable,
                }
            )

        data["total"] = total
        summary[fy]["funds"].append(data)

        net_total["ltcg"] += total["ltcg"]
        net_total["stcg"] += total["stcg"]
        net_total["tax_ltcg"] += total["tax_ltcg"]
        summary[fy]["total"] = net_total
    return summary


@app.post(
    "/api/process/",
    response_model=CASResponse,
    responses={400: {"model": CASErrorResponse}},
    summary="Process CAS PDF file.",
)
async def process_cas(password: str = Form(...), cas: UploadFile = File(...)):
    """Process CAS PDF file."""
    loop = asyncio.get_running_loop()
    result = {"status": "error", "message": "Unknown Error", "cas": {}, "gains": None}
    try:
        cas = await loop.run_in_executor(None, read_cas_pdf, cas.file, password)
        try:
            cg_report = CapitalGainsReport(cas)
        except IncompleteCASError:
            cg_report = None
        result.update(status="OK", message="", cas=cas, gains=prepare_gains(cg_report))
    except Exception as e:
        result.update(message=str(e))
    if result["status"] == "error":
        return JSONResponse(result, status_code=400)
    return result


handler = Mangum(app)
