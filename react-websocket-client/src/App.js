import React, { useState, useEffect } from 'react';

function App() {
  const [output, setOutput] = useState('');
  let socket;

  useEffect(() => {
    const connectWebSocket = () => {
      socket = new WebSocket('ws://localhost:2200');

      socket.onopen = () => {
        console.log('WebSocket connected');
      };

      socket.onmessage = event => {
        console.log('WebSocket message received: ', event.data);
        setOutput(prevOutput => prevOutput + event.data);
      };

      socket.onclose = () => {
        console.log('WebSocket closed');
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      };

      socket.onerror = error => {
        console.error('WebSocket error: ', error);
      };
    };

    connectWebSocket();

    return () => {
      socket && socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Console Output</h1>
      <pre>{output}</pre>
    </div>
  );
}

export default App;
