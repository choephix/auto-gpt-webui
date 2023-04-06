// useWebSocket.js
import { useState, useEffect } from 'react';

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState(null as WebSocket | null);

  useEffect(() => {
    let isMounted = true;

    const connectWebSocket = () => {
      if (!isMounted) {
        return;
      }

      console.log('Connecting to WebSocket...');
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log('WebSocket connected');
        if (isMounted) {
          setSocket(socket);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket closed');
        if (isMounted) {
          setSocket(null);
        }
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      };

      socket.onerror = error => {
        console.error('WebSocket error: ', error);
      };
    };

    if (!socket) {
      connectWebSocket();
    } else {
      console.log('WebSocket already exists', socket);
    }

    return () => {
      isMounted = false;
    };
  }, [socket, url]);

  return socket;
};

export default useWebSocket;
