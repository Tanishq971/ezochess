import { createContext , useContext, useState, type ReactNode } from "react";
import { type GameContextType } from "./types";

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({children} : {children:ReactNode}) =>{
     const [color , setColor] = useState<'w' | 'b' | null >(null)

    return <GameContext.Provider value = {{color , setColor}}>
        {children}
    </GameContext.Provider>
}

export const useGame = () =>{
    const context = useContext(GameContext);
    if(!context) throw new Error("Game context issue")
    
    return context
}