import React, { useState, useEffect } from 'react';
import { GUI } from './GUI';
import useWebSocket from './useWebSocket';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const connectWebSocket = () => {
      if (!isMounted) {
        return;
      }

      console.log('Connecting to WebSocket...');
      const socket = new WebSocket('ws://localhost:2200');

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
  }, [socket]);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return (
    <div>
      <GUI socket={socket} />
    </div>
  );
}

export default App;
