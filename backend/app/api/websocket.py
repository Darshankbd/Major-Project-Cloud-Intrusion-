from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.services.traffic_simulator import traffic_simulator

ws_router = APIRouter()

@ws_router.websocket("/ws/live-stream")
async def websocket_live_stream(websocket: WebSocket):
    """
    WebSocket endpoint broadcasting real-time simulated network traffic
    and ML threat predictions to connected frontend clients.
    """
    await traffic_simulator.connect_websocket(websocket)
    try:
        while True:
            # Keep the connection alive and listen for client messages or disconnect
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        traffic_simulator.disconnect_websocket(websocket)
    except Exception:
        traffic_simulator.disconnect_websocket(websocket)
