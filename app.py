import asyncio
from typing import Dict

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel

from casparser import read_cas_pdf
from casparser.types import CASParserDataType


class CASResponse(BaseModel):
    status: str
    message: str
    cas: CASParserDataType


class CASErrorResponse(CASResponse):
    status: str = "error"
    cas: Dict


app = FastAPI()


@app.get("/", response_class=HTMLResponse)
def index():
    return """<html></html>"""


@app.post(
    "/api/process/",
    response_model=CASResponse,
    responses={400: {"model": CASErrorResponse}},
    summary="Process CAS PDF file.",
)
async def process_cas(password: str = Form(...), cas: UploadFile = File(...)):
    """Process CAS PDF file."""
    loop = asyncio.get_running_loop()
    result = {"status": "error", "message": "Unknown Error", "cas": {}}
    try:
        cas = await loop.run_in_executor(None, read_cas_pdf, cas.file, password)
        result.update(status="OK", message="", cas=cas)
    except Exception as e:
        result.update(message=str(e))
    if result["status"] == "error":
        return JSONResponse(result, status_code=400)
    return result
