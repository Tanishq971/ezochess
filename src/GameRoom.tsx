import { useSocket } from "./SocketContext";
import { useEffect, useState, useRef, useMemo } from "react";
import { Chess } from "chess.js";
import { MOVE } from "./messages";
import useSound from 'use-sound';

function GameRoom() {
  const { socketRef, isReady } = useSocket();
  const chessRef = useRef(new Chess());
  const [board, setBoard] = useState(chessRef.current.board());
  const [from, setFrom] = useState<string | null>(null);
  const [isCheck ,  setIsCheck] = useState<boolean>(false)
  const pieceImages: Record<string, string> = {
    wp: "/pieces/wp.png", bp: "/pieces/bp.png",
    wr: "/pieces/wr.png", br: "/pieces/br.png",
    wn: "/pieces/wn.png", bn: "/pieces/bn.png",
    wb: "/pieces/wb.png", bb: "/pieces/bb.png",
    wq: "/pieces/wq.png", bq: "/pieces/bq.png",
    wk: "/pieces/wk.png", bk: "/pieces/bk.png",
  };


  const [play] = useSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3")


  
  useEffect(() => {
    if (!isReady) return;

    const socket = socketRef.current;
    const onMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      console.log("move message --- " , msg)
      const { from: f, to: t } = msg.payload;
      setIsCheck(msg.isCheck)
      chessRef.current.move({ from: f, to: t });
      setBoard(chessRef.current.board());
    };

    socket?.addEventListener("message", onMessage);
    return () => socket?.removeEventListener("message", onMessage);
  }, [isReady]);


  useEffect(()=>{
     play()
  } , [board])
  const boardSize = useMemo(() => {
    if (typeof window === "undefined") return 560;
    
    const maxSize = Math.min(
      window.innerWidth * 0.9, 
      window.innerHeight * 0.8,
      620
    );
    return Math.floor(maxSize / 8) * 8;
  }, []);

  return (
    <div className="w-full h-screen bg-[#1c1c1c] flex items-center justify-center p-4">
      <div className="relative flex flex-col items-center">
          <div className="font-bold text-6xl  text-amber-50">{isCheck && "Check"}</div>
    
        <div 
          className="grid grid-cols-8 rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl"
          style={{
            width: `${boardSize}px`,
            height: `${boardSize}px`,
          }}
        >
          {board.map((row, i) =>
            row.map((cell, j) => {
              const isDark = (i + j) % 2 === 1;
              const pos = String.fromCharCode(97 + j) + (8 - i);

              return (
                <div
                  key={`${i}-${j}`}
                  onClick={() => {
                    if (!from) {
                      setFrom(pos);
                    } else {
                      socketRef.current?.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: { from, to: pos },
                        })
                      );
                      setFrom(null);
                    }
                  }}
                  className={`
                    relative flex items-center justify-center 
                    aspect-square
                    ${isDark ? "bg-[#669736]" : "bg-[#f7f7cf]"}
                    hover:brightness-110 active:brightness-95
                    cursor-pointer transition-all duration-150
                  `}
                >
                  
                  {cell && (
                    <img
                      src={pieceImages[`${cell.color}${cell.type}`]}
                      alt={`${cell.color}${cell.type}`}
                      className="w-[85%] h-[85%] object-contain pointer-events-none select-none drop-shadow-md"
                    />
                  )}

                 
                  {j === 0 && (
                    <span className="absolute top-1 left-1.5 text-xs font-bold text-gray-800/90 pointer-events-none">
                      {8 - i}
                    </span>
                  )}

             
                  {i === 7 && (
                    <span className="absolute bottom-1 right-1.5 text-xs font-bold text-gray-800/90 pointer-events-none">
                      {String.fromCharCode(97 + j)}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>


        <div className="mt-6 text-gray-400 text-sm">
          {chessRef.current.turn() === 'w' ? "White's turn" : "Black's turn"}
        </div>
      </div>
    </div>
  );
}

export default GameRoom;