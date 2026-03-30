import { LOBBY, INIT_GAME } from "./messages";
import { useSocket } from "./SocketContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function ChessHero() {
  const { socketRef, isReady } = useSocket();
  const navigate = useNavigate()
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "waiting" | "playing"
  >("idle");

  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    if (!isReady) return;

    const socket = socketRef.current!;
    console.log("Attaching listeners...");

    const onMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      console.log("Received:", msg);

      if (msg.type === LOBBY) {
        setStatus("waiting");
      }

      if (msg.type === INIT_GAME) {
        setStatus("playing");
        navigate(`/game/${msg.payload.gameid}`)
        setGameData(msg.payload);
      }
    };

    socket.addEventListener("message", onMessage);


    if (socket.readyState === WebSocket.OPEN) {
      setStatus("connected");
    }

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [isReady]);

  const joinHandler = () => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not ready ");
      return;
    }

    socket.send(JSON.stringify({ type: INIT_GAME }));
    console.log("Sent INIT_GAME");

    setStatus("connecting");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#1c1c1c] text-white px-6">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800"
            alt="Chess Board"
            className="w-96 object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Play Chess Online
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            {status === "idle" && "Loading..."}
            {status === "connected" && "Click to find a game"}
            {status === "connecting" && "Connecting..."}
            {status === "waiting" && "Waiting for opponent... ♟️"}
            {status === "playing" && "Game started!"}
          </p>

          {gameData && (
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <pre className="text-sm text-green-300">
                {JSON.stringify(gameData, null, 2)}
              </pre>
            </div>
          )}

          {status !== "playing" && (
            <button
              onClick={joinHandler}
              disabled={!isReady || status === "waiting"}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 px-10 py-4 rounded-2xl text-xl font-semibold transition transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
              {status === "waiting" ? "Searching..." : "Play Game"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}