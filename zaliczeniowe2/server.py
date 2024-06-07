from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import urllib.parse
import random
import time
import asyncio

images = [
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='blue'/></svg>",
    #"data:image/svg+xml,<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='333' y='112' width='246' height='235' fill='#ff0000' /></svg>"
    #"data:image/svg+xml,<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='294' y='259' width='188' height='246' fill='#fdf7f7' /><rect x='265' y='386' width='249' height='97' fill='#fdf7f7' /><rect x='125' y='234' width='534' height='53' fill='#e10e0e' /><rect x='163' y='143' width='451' height='89' fill='#e10e0e' /><rect x='225' y='87' width='312' height='67' fill='#e10e0e' /><rect x='153' y='203' width='477' height='42' fill='#e10e0e' /><rect x='335' y='55' width='126' height='50' fill='#e10e0e' /><rect x='110' y='273' width='588' height='50' fill='#e10e0e' /><rect x='378' y='82' width='17' height='28' fill='#a78181' /><rect x='328' y='125' width='29' height='48' fill='#a78181' /><rect x='269' y='173' width='20' height='37' fill='#a78181' /><rect x='464' y='185' width='35' height='49' fill='#a78181' /><rect x='543' y='245' width='18' height='29' fill='#a78181' /><rect x='481' y='439' width='26' height='35' fill='#a78181' /><rect x='454' y='465' width='13' height='23' fill='#a78181' /><rect x='417' y='470' width='5' height='20' fill='#a78181' /><rect x='354' y='243' width='23' height='37' fill='#a78181' /><rect x='234' y='235' width='16' height='42' fill='#a78181' /><rect x='190' y='251' width='13' height='44' fill='#a78181' /><rect x='432' y='138' width='52' height='28' fill='#a78181' /><rect x='312' y='325' width='16' height='32' fill='#a78181' /><rect x='329' y='127' width='13' height='23' fill='#ffffff' /><rect x='385' y='83' width='5' height='17' fill='#ffffff' /><rect x='438' y='141' width='21' height='26' fill='#ffffff' /><rect x='476' y='187' width='19' height='39' fill='#ffffff' /><rect x='548' y='251' width='13' height='20' fill='#ffffff' /><rect x='363' y='248' width='5' height='27' fill='#ffffff' /><rect x='235' y='237' width='13' height='28' fill='#ffffff' /><rect x='188' y='252' width='13' height='26' fill='#ffffff' /><rect x='267' y='166' width='8' height='32' fill='#ffffff' /><rect x='328' y='329' width='8' height='28' fill='#ffffff' /><rect x='354' y='346' width='27' height='109' fill='#ffffff' /><rect x='394' y='360' width='3' height='68' fill='#ffffff' /><rect x='326' y='395' width='3' height='71' fill='#ffffff' /><rect x='298' y='405' width='9' height='53' fill='#ffffff' /><rect x='422' y='402' width='34' height='51' fill='#ffffff' /></svg>",
    #"data:image/svg+xml,<svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='230' y='93' width='311' height='391' fill='#ffea00' /><rect x='160' y='150' width='439' height='284' fill='#ffea00' /><rect x='289' y='186' width='21' height='37' fill='#000000' /><rect x='460' y='182' width='32' height='42' fill='#000000' /><rect x='205' y='309' width='347' height='25' fill='#000000' /></svg>"
]

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
    i = random.choice(range(len(images)))
    # Losowe błędy
    if random.choice(range(100)) == 0:
        raise HTTPException(status_code=500, detail="Internal Server Error")

    # Losowe duże pliki
    if random.choice(range(100)) == 0:
        return JSONResponse(content={"image": "x" * 10 * 1024 * 1024})  # 10MB image represented as a large string

    # Losowe opóźnienia
    if random.choice(range(100)) == 0:
        await asyncio.sleep(10)

    return JSONResponse(content={"image": images[i]})
