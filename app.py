import asyncio

from casparser import read_cas_pdf
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import HTMLResponse


app = FastAPI()


@app.get("/", response_class=HTMLResponse)
def index():
    return """<html></html>"""


@app.post("/process")
async def process_cas(password: str = Form(...), cas: UploadFile = File(...)):
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, read_cas_pdf, cas.file, password)
    return result
