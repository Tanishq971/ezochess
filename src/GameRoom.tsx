import { useSocket } from "./SocketContext";
import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import Board from "./board";
import useSound from 'use-sound';
import { INIT_GAME } from "./messages";


function GameRoom() {
  const { socketRef, isReady } = useSocket();
  const chessRef = useRef(new Chess());
  const [board, setBoard] = useState(chessRef.current.board());
  const [from, setFrom] = useState<string>();
  const [isCheck, setIsCheck] = useState<boolean>(false)
  const [captured , setCaptured]= useState<boolean> (false);
  const [self] = useSound("https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3")
  const [capture] = useSound('https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3')

  
  useEffect(() => {
    if (!isReady) return;

    const socket = socketRef.current;
    const onMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      const { from: f, to: t } = msg.payload;
      setIsCheck(msg.isCheck)
      const obj = chessRef.current.move({ from: f, to: t });
     
      if(obj.isCapture()){
        setCaptured(true);
      }
      setBoard(chessRef.current.board());

      if(msg.type === INIT_GAME){
        console.log("inside game room" , msg.payload)
      }
    };

    socket?.addEventListener("message", onMessage);
    return () => socket?.removeEventListener("message", onMessage);
  }, [isReady]);


  useEffect(() => {
    if(captured){
      capture()
      setCaptured(false)
    }else{
      self();
    }
  }, [board])
  

  return (
    <div className="w-full h-screen bg-[#1c1c1c] flex items-center justify-center p-4">
      <div className="relative flex flex-col items-center">
        <div className="font-bold text-6xl  text-amber-50">{isCheck && "Check"}</div>
        <Board board={board} from={from} setFrom={setFrom} setBoard={setBoard} isCheck={isCheck} setIsCheck={setIsCheck} chessRef={chessRef} />
        <div className="mt-6 text-gray-400 text-sm">
          {chessRef.current.turn() === 'w' ? "White's turn" : "Black's turn"}
        </div>
      </div>
    </div>
  );
}

export default GameRoom;