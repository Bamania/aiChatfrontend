// utils/websocket.ts
let socket: WebSocket | null = null;

// connectWebsocket has a type of a void function here !
export function connectWebSocket(handleData: (msg: string) => void) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket("ws://localhost:8080"); // your backend websocket server

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("New message from server:", event.data);
      // now we can define the onMessage to handle the data the way we want
      // from the server
      handleData(event.data);
    };

    socket.onclose = () => {
      console.log(" WebSocket closed");
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };
  }

  return socket;
}

export function sendMessage(message: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.warn("WebSocket not connected.");
  }
}
