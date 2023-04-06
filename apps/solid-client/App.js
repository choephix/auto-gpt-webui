import { createSignal, onCleanup } from 'solid-js';

const RELATIVE_PATH_TO_AUTOGPT = '../../auto-gpt';
const exeActions = [
  'ls -la',
  `pip install -r ${RELATIVE_PATH_TO_AUTOGPT}/requirements.txt --target=${RELATIVE_PATH_TO_AUTOGPT}`,
  'python ../auto-gpt/',
];

function App() {
  const [output, setOutput] = createSignal('');

  const connectWebSocket = () => {
    const socket = new WebSocket('ws://localhost:2200');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = event => {
      console.log('WebSocket message received: ', event.data);
      setOutput(event.data);
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

    onCleanup(() => {
      socket && socket.close();
    });
  };

  connectWebSocket();

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
      <pre>{output()}</pre>
    </div>
  );
}

export default App;
