import React, { useState, useEffect } from 'react';

const RELATIVE_PATH_TO_AUTOGPT = '../../auto-gpt';
const exeActions = [
  'ls -la',
  // `pip install -r ${RELATIVE_PATH_TO_AUTOGPT}/requirements.txt --target=${RELATIVE_PATH_TO_AUTOGPT}`,
  `pip install -r ${RELATIVE_PATH_TO_AUTOGPT}/requirements.txt`,
  `python ${RELATIVE_PATH_TO_AUTOGPT}/scripts/main.py`,
];

function GUI({ socket }) {
  const [output, setOutput] = useState('');

  useEffect(() => {
    function onMessage(event) {
      console.log('WebSocket message received: ', event.data);
      setOutput(event.data);
    }

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, [socket]);

  function execc(command) {
    fetch('http://localhost:2200/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  return (
    <div>
      {exeActions.map((action, index) => (
        <div key={index}>
          <button key={index} onClick={() => execc(action)}>
            {action}
          </button>
        </div>
      ))}
      <h1>Console Output</h1>
      <pre>{output}</pre>
    </div>
  );
}

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectWebSocket = () => {
      let socket = new WebSocket('ws://localhost:2200');
      setSocket(socket);

      socket.onopen = () => {
        console.log('WebSocket connected');
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

    if (!socket) {
      console.log('Connecting to WebSocket...');
      connectWebSocket();
    } else {
      console.log('WebSocket already connected', socket);
    }

    // return () => {
    //   socket && socket.close();
    // };
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
