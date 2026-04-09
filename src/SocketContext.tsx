import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SocketContextType = {
  socketRef: React.MutableRefObject<WebSocket | null>;
  isReady: boolean;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("https://ezochess-backend.onrender.com/");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected");
      setIsReady(true);
    };

    socket.onerror = (err) => {
      console.error("Socket error:", err);
    };

    socket.onclose = () => {
      console.log("Socket closed ");
      setIsReady(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketRef, isReady }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
};