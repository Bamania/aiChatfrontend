// utils/websocket.ts
interface WebSocketConnection {
  socket: WebSocket | null;
  isConnected: boolean;
}

const wsConnection: WebSocketConnection = {
  socket: null,
  isConnected: false
};

// connectWebsocket has a type of a void function here !
export function connectWebSocket(handleData: (msg: string) => void): WebSocket {
  if (!wsConnection.socket || wsConnection.socket.readyState !== WebSocket.OPEN) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!socketUrl) {
      throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined");
    }
    
    wsConnection.socket = new WebSocket(socketUrl);

    wsConnection.socket.onopen = () => {
      console.log("WebSocket connected");
      wsConnection.isConnected = true;
    };

    wsConnection.socket.onmessage = (event) => {
      console.log("New message from server:", event.data);
      // now we can define the onMessage to handle the data the way we want
      // from the server
      handleData(event.data);
    };

    wsConnection.socket.onclose = () => {
      console.log(" WebSocket closed");
      wsConnection.isConnected = false;
    };

    wsConnection.socket.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
      wsConnection.isConnected = false;
    };
  }

  return wsConnection.socket;
}

export function sendMessage(message: string): boolean {
  if (wsConnection.socket && wsConnection.socket.readyState === WebSocket.OPEN) {
    wsConnection.socket.send(message);
    return true;
  } else {
    console.warn("WebSocket not connected.");
    return false;
  }
}
