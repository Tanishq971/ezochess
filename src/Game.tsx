import { LOBBY, INIT_GAME } from "./messages";
import { useSocket } from "./SocketContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "./GameContext";
import Background from "./Background";

export default function ChessHero() {
  const { socketRef, isReady } = useSocket();
  const navigate = useNavigate();
  const { setColor } = useGame();

  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "waiting" | "playing"
  >("idle");

  useEffect(() => {
    if (!isReady) return;

    const socket = socketRef.current!;

    const onMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);

      if (msg.type === LOBBY) setStatus("waiting");

      if (msg.type === INIT_GAME) {
        setStatus("playing");
        setColor(msg.payload.color);
        navigate(`/game/${msg.payload.gameid}`);
      }
    };

    socket.addEventListener("message", onMessage);

    if (socket.readyState === WebSocket.OPEN) {
      setStatus("connected");
    }

    return () => socket.removeEventListener("message", onMessage);
  }, [isReady, socketRef, navigate, setColor]);

  const joinHandler = () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({ type: INIT_GAME }));
    setStatus("connecting");
  };

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      <Background />

      
      <img
        src="logo.png"
        alt="Packing Chess"
        className="absolute top-4 left-1/2 -translate-x-1/2 z-40 
                   w-36 sm:w-44 md:w-56 lg:w-64 
                   drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
      />

  
      <div className="relative z-30 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center">

       

        <p className="text-base sm:text-lg text-gray-200 mt-3 mb-6 sm:mb-8 max-w-sm sm:max-w-md">
          {status === "idle" && "Loading..."}
          {status === "connecting" && "Connecting to server..."}
          {status === "waiting" && "Waiting for opponent..."}
          {status === "playing" && "Game starting!"}
        </p>

        <button
          onClick={joinHandler}
          disabled={!isReady || status === "waiting"}
          className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 
                     text-black px-8 sm:px-12 py-4 sm:py-5 rounded-2xl 
                     text-lg sm:text-2xl font-bold 
                     transition-all transform hover:scale-105 sm:hover:scale-110 
                     shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed mb-3 sm:mb-4"
        >
          {status === "waiting" ? "Searching..." : "Play Online"}
        </button>

    
        <button
          disabled
          className="w-full sm:w-auto bg-white/20 backdrop-blur-md border border-white/30 
                     px-6 sm:px-10 py-3 sm:py-4 rounded-2xl 
                     text-base sm:text-lg font-semibold 
                     hover:bg-white/30 transition"
        >
          Play with Friend
        </button>
      </div>
    </div>
  );
}