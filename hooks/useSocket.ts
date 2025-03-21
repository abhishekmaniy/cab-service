import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useWebSocket = (userId: string, userType: "rider" | "driver") => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId || !userType) return;

    const newSocket = io("http://localhost:8000", {
      transports: ["websocket"], // Ensure WebSocket transport
    });

    newSocket.on("connect", () => {
      console.log(`✅ Connected to Socket.IO server as ${userType}`);

      // Emit an event based on user type (rider or driver)
      if (userType === "rider") {
        newSocket.emit("event:rider_join", { riderId: userId });
      } else if (userType === "driver") {
        newSocket.emit("event:driver_join", { driverId: userId });
      }

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
  }, [userId, userType]); // Reconnect if user ID or type changes

  return socket;
};

export default useWebSocket;
