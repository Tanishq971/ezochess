import { type ChessBackgroundProps } from "./types";

export default function Background({ variant = "hero" }: ChessBackgroundProps) {
  const isGame = variant === "game";

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">

      <div className="absolute inset-0 bg-linear-to-br from-[#9a4da7] via-[#a343c1] to-[#17deee]" />

      <div className={`absolute inset-0 ${isGame ? "bg-black/60" : "bg-black/40"} z-10`} />

      <div
        className={`absolute inset-0 
        ${
          isGame
            ? "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]"
            : "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)]"
        } z-0`}
      />

      <div
        className={`absolute bottom-0 left-0 flex items-end pointer-events-none z-20
        ${isGame ? "opacity-40 blur-sm" : ""}`}
      >
        <img
          src="/BlackQueen.png"
          className="object-contain opacity-75 
                     h-[clamp(140px,20vw,360px)]
                     translate-x-[clamp(10px,2vw,40px)]
                     -translate-y-[clamp(10px,2vw,40px)]
                     max-[439px]:hidden"
        />

      
        <img
          src="/King.png"
          className="object-contain z-30 
                     h-[clamp(220px,30vw,560px)]
                     -ml-[clamp(60px,6vw,130px)]
                     translate-x-[clamp(40px,6vw,130px)]
                     max-[439px]:ml-0
                     max-[439px]:translate-x-0
                     drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
        />
      </div>

      <div
        className={`absolute bottom-0 right-0 flex items-end pointer-events-none z-20
        ${isGame ? "opacity-40 blur-sm" : ""}`}
      >
     
        <img
          src="/KingW.png"
          className="object-contain scale-x-[-1] z-30
                     h-[clamp(220px,30vw,560px)]
                     -translate-x-[clamp(40px,6vw,130px)]
                     max-[439px]:translate-x-0
                     drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)] translate-y-2.5"
        />

        {/* White Queen (hidden on small screens) */}
        <img
          src="/WhiteQueen.png"
          className="object-contain scale-x-[-1.1] opacity-75
                     h-[clamp(140px,20vw,360px)]
                     -ml-[clamp(60px,6vw,130px)]
                     -translate-y-[clamp(10px,2vw,40px)]
                     max-[439px]:hidden"
        />
      </div>
    </div>
  );
}