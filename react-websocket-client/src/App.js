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

  function execc() {
    fetch('http://localhost:2200/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: 'ls -la' })
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  return (
    <div>
      <button onClick={execc}>Execute</button>
      <h1>Console Output</h1>
      <pre>{output}</pre>
    </div>
  );
}

export default App;
