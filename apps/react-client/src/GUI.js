import AnsiToHtml from 'ansi-to-html';
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';

const ansiToHtml = new AnsiToHtml();

const exeActions = [
  'ls -la',
  // `pip install -r ${RELATIVE_PATH_TO_AUTOGPT}/requirements.txt --target=${RELATIVE_PATH_TO_AUTOGPT}`,
  `pip install -r requirements.txt`,
  `python scripts/main.py`,
];

export function GUI({ socket }) {
  const [output, setOutput] = useState('');

  useEffect(() => {
    function onMessage(event) {
      console.log('WebSocket message received: ', event.data);
      const rawOutput = String(event.data)
        .replace(/.+Thinking\.\.\..*/gm, '')
        .replace(/^\s*$[\n\r]{1,}/gm, '🧠 -- Thinking --\n');
      const htmlOutput = ansiToHtml.toHtml(rawOutput);
      setOutput(htmlOutput);
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
      <section>
        <Button onClick={() => updateEnvVariable('OPENAI_API_KEY')}>Set OpenAI API Key</Button>
        <Button onClick={() => updateEnvVariable('GOOGLE_API_KEY')}>Set Google API Key</Button>
        {/* <Button onClick={() => updateEnvVariable('ELEVENLABS_API_KEY')}>Set 11Labs API Key</Button> */}
        <Button onClick={() => updateEnvVariable('CUSTOM_SEARCH_ENGINE_ID')}>
          Set Custom Search Engine ID
        </Button>
      </section>
      <hr />
      <section>
        {exeActions.map((action, index) => (
          <Button key={index} onClick={() => execc(action)}>
            {action}
          </Button>
        ))}
      </section>
      <hr />
      <section>
        <Button onClick={() => killProcess()}>Kill</Button>
        <Button onClick={() => sendInput('y')}>Send "y"</Button>
        <Button onClick={() => sendInput('Jonkata')}>Send "Jonkata"</Button>
        <Button onClick={() => sendInput('Come up with a funny joke')}>Send "Joke"</Button>
        <Button onClick={() => sendInput(' ')}>Send "⏎"</Button>
      </section>
      <hr />
      {output && (
        <>
          <pre dangerouslySetInnerHTML={{ __html: output }}></pre>
          <hr />
        </>
      )}
    </div>
  );
}
