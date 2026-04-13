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
    <div className="relative w-full min-h-screen text-white">

      <Background />

     {/* <PlayersOnline/> */}

      <h1 className="absolute top-6 left-1/2 -translate-x-1/2 z-40 
                     text-3xl md:text-5xl font-extrabold tracking-widest 
                     text-yellow-300 drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
        CHESS BATTLE
      </h1>

      <div className="relative z-30 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen px-6 text-center">

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
          Play Chess Online
        </h2>

        <p className="text-lg text-gray-200 mt-4 mb-8 max-w-md">
          {status === "idle" && "Loading..."}
          {status === "connecting" && "Connecting to server..."}
          {status === "waiting" && "Waiting for opponent..."}
          {status === "playing" && "Game starting!"}
        </p>

        <button
          onClick={joinHandler}
          disabled={!isReady || status === "waiting"}
          className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 
                     text-black px-12 py-5 rounded-2xl text-2xl font-bold 
                     transition-all transform hover:scale-110 shadow-2xl 
                     disabled:opacity-70 disabled:cursor-not-allowed mb-4"
        >
          {status === "waiting" ? "Searching..." : "Play Online"}
        </button>

        <button
          disabled
          className="bg-white/20 backdrop-blur-md border border-white/30 
                     px-10 py-4 rounded-2xl text-lg font-semibold 
                     hover:bg-white/30 transition"
        >
          Play with Friend
        </button>
      </div>
    </div>
  );
}