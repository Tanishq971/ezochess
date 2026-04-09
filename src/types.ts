import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";


export type BoardSquares = {
    square:Square;
    type:PieceSymbol;
    color:Color
} | null

export type Board =  BoardSquares[][]

export type BoardParameters = {
    board:Board;
    from:string |undefined;
    isCheck:boolean;
    chessRef:React.RefObject<Chess>;
    setBoard:React.Dispatch<React.SetStateAction<({
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null)[][]>>;
    setIsCheck:React.Dispatch<React.SetStateAction<boolean>>;
    setFrom: React.Dispatch<React.SetStateAction<string | undefined>>
}