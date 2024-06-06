import time
import asyncio
from datetime import datetime
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>WebSocket Time</title>
    </head>
    <body>
        <h1>WebSocket Time</h1>
        <div id="time"></div>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var timeDiv = document.getElementById('time');
                timeDiv.innerText = "Current time: " + event.data;
            };
        </script>
    </body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        now = datetime.utcnow().isoformat()
        await websocket.send_text(now)
        await asyncio.sleep(1)
