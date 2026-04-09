import { pieceImages } from "./component";
import { useSocket } from "./SocketContext";
import { useMemo } from "react";
import { MOVE } from "./messages";
import { type BoardParameters } from "./types";
// import { type Square } from "chess.js";
// import { useState } from "react";



function Board({ board, from, setFrom }: BoardParameters) {
    const { socketRef } = useSocket();
    // const [blocks, setBlocks] = useState([]);
    // console.log("from --- ", from)
    // const arr = chessRef.current.moves({
    //     square: from as Square
    // })
    // console.log(arr)

    // const st = new Set(arr)


    //  for(const p of arr){
    //     console.log(p , "---" , st.has(p))
    //  }
    const boardSize = useMemo(() => {
        if (typeof window === "undefined") return 560;

        const maxSize = Math.min(
            window.innerWidth * 0.9,
            window.innerHeight * 0.8,
            620
        );
        return Math.floor(maxSize / 8) * 8;
    }, []);


    return <div
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

                // if (!from) {
                //     const arr = chessRef.current.moves({
                //         square: from as Square
                //     })
                // } else {

                // }

                // const elements = new Set(arr)

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
                                setFrom(undefined);
                            }
                        }}

                    className={`
                       relative flex items-center justify-center 
                       aspect-square
                       ${isDark ? "bg-[#6447e8]" : "bg-[#e7bef3]"}
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

}


export default Board;