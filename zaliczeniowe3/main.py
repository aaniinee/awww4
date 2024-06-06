from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, FileResponse
from typing import List

app = FastAPI()

# Lista przechowująca adresy URL obrazków
images_urls: List[str] = []

# Zarządzanie połączeniami WebSocket
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# Strona HTML wyświetlająca obrazki
@app.get("/")
async def get():
    return HTMLResponse(html)

# Endpoint do dodawania obrazków
@app.post("/add_image/")
async def add_image(image_url: str):
    images_urls.append(image_url)
    message = f"New image added: {image_url}"
    await manager.broadcast(message)
    return {"message": "Image added"}

# Endpoint do pobierania obrazków
@app.get("/get_images/")
async def get_images():
    return {"images_urls": images_urls}

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Images</title>
    </head>
    <body>
        <h1>Images</h1>
        <div id="images"></div>
        <script>
            // Pobierz obrazki po załadowaniu strony
            fetch('/get_images/')
                .then(response => response.json())
                .then(data => {
                    const imagesDiv = document.getElementById('images');
                    data.images_urls.forEach(imageUrl => {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        imagesDiv.appendChild(img);
                    });
                });
        </script>
    </body>
</html>
"""
