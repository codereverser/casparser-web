import asyncio
import itertools
import time
from typing import Optional

from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from mangum import Mangum

from casparser import read_cas_pdf, CapitalGainsReport
from casparser.analysis.gains import Fund
from casparser.exceptions import IncompleteCASError

from api.settings import APISettings, BASE_DIR
from api.types import CASResponse, CASErrorResponse


app = FastAPI()
settings = APISettings()


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    headers = request.headers
    if "origin" not in headers:
        return JSONResponse(
            {"status": "error", "message": "Forbidden!"}, status_code=403
        )
    response = await call_next(request)
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(url) for url in settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


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
                    "buy_date": txn.purchase_date,
                    "buy_price": txn.purchase_value,
                    "units": txn.units,
                    "coa": txn.coa,
                    "sell_date": txn.sale_date,
                    "sell_price": txn.sale_value,
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
    result = {
        "status": "error",
        "message": "Unknown Error",
        "cas": {},
        "gains": None,
        "stats": {},
    }
    try:
        cas_dict = await loop.run_in_executor(None, read_cas_pdf, cas.file, password)
        result.update(status="OK", message="", cas=cas_dict)
        try:
            cg_report = CapitalGainsReport(cas_dict)
        except IncompleteCASError:
            result.update(status="warn", message="Incomplete CAS")
        else:
            result.update(gains=prepare_gains(cg_report))
            result.update(
                stats={
                    "invested": cg_report.invested_amount,
                    "current": cg_report.current_value,
                }
            )
            if cg_report.has_error():
                result.update(status="warn", message=cg_report.errors)
    except Exception as e:
        result.update(message=str(e))
    if result["status"] == "error":
        return JSONResponse(result, status_code=400)
    return result


handler = Mangum(app)
