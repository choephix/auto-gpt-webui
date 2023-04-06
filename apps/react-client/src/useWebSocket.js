// useWebSocket.js
import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url, onOpen, onClose, onError) => {
  const [socket, setSocket] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    if (ws.current) {
      return;
    }
    const connectWebSocket = () => {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        onOpen && onOpen();
        setSocket(ws.current);
      };

      ws.current.onclose = () => {
        onClose && onClose();
        setSocket(null);
        ws.current = null;
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      };

      ws.current.onerror = error => {
        onError && onError(error);
      };
    };

    if (!socket) {
      connectWebSocket();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [url, onOpen, onClose, onError]);

  return socket;
};

export default useWebSocket;
