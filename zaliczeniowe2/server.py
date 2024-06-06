from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import random
import time
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/image")
async def get_image():
    # Losowe błędy
    if random.choice(range(10)) == 0:
        raise HTTPException(status_code=500, detail="Internal Server Error")

    # Losowe duże pliki
    if random.choice(range(10)) == 0:
        return JSONResponse(content={"image": "x" * 10 * 1024 * 1024})  # 10MB image represented as a large string

    # Losowe opóźnienia
    if random.choice(range(10)) == 0:
        await asyncio.sleep(10)

    return JSONResponse(content={"image": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='blue'/></svg>"})
