import React, { useState, useEffect } from 'react';

const RELATIVE_PATH_TO_AUTOGPT = '.';
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

  function sendInput(input) {
    fetch('http://localhost:2200/input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  function killProcess() {
    fetch('http://localhost:2200/kill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }

  async function setEnvVariable(key, value) {
    try {
      const response = await fetch('http://localhost:2200/setenv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error setting environment variable:', error);
    }
  }

  async function updateEnvVariable(key) {
    const value = prompt(`Enter value for ${key}:`);
    await setEnvVariable(key, value);
  }

  return (
    <div>
      <button onClick={() => updateEnvVariable('OPENAI_API_KEY')}>Set OpenAI API Key</button>
      <button onClick={() => updateEnvVariable('GOOGLE_API_KEY')}>Set Google API Key</button>
      <button onClick={() => updateEnvVariable('ELEVENLABS_API_KEY')}>Set 11Labs API Key</button>
      <button onClick={() => updateEnvVariable('CUSTOM_SEARCH_ENGINE_ID')}>
        Set Custom Search Engine ID
      </button>
      <hr />
      {exeActions.map((action, index) => (
        <button key={index} onClick={() => execc(action)}>
          {action}
        </button>
      ))}
      <hr />
      <button onClick={() => killProcess()}>Kill</button>
      <button onClick={() => sendInput('y')}>Send "y"</button>
      <button onClick={() => sendInput('Jonkata')}>Send "Jonkata"</button>
      <button onClick={() => sendInput('Come up with a funny joke')}>Send "Joke"</button>
      <button onClick={() => sendInput(' ')}>Send "⏎"</button>
      <hr />
      <h1>Console Output</h1>
      <pre>{output}</pre>
      <hr />
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
        setSocket(null);
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
      console.log('WebSocket already exists', socket);
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
