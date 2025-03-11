import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the correct socket state
const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Ensure socket is initialized once
    const newSocket = io("http://localhost:8001", {
      transports: ["websocket"], // Ensure WebSocket transport
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, []);

  return socket;
};

export default useWebSocket;
