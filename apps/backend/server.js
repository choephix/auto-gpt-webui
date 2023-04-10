const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const WebSocket = require('ws');

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const yaml = require('js-yaml');
const kill = require('tree-kill');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 2200;
const RELATIVE_PATH_TO_AUTOGPT = '../../auto-gpt';
// const PATH_TO_AI_SETTINGS_FILE = fs.existsSync(
//   path.join(__dirname, RELATIVE_PATH_TO_AUTOGPT, 'ai_settings.yaml')
// )
//   ? 'ai_settings.yaml'
//   : 'last_run_ai_settings.yaml';
const PATH_TO_AI_SETTINGS_FILE = 'ai_settings.yaml';

const OBFUSCATE_ENV_VARS_BEFORE_SENDING_TO_CLIENT = true;

const wss = new WebSocket.Server({ noServer: true });

////////////////

const state = {
  activeProcess: null,
  activeCommandString: null,
  consoleOutputLines: [],
};

let configuration = loadConfiguration();

function obfuscateObjectProperties(object) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key,
      value.replace(/./g, '*'),
    ]),
  );
}

function loadConfiguration() {
  const envFilePath = path.join(__dirname, RELATIVE_PATH_TO_AUTOGPT, '.env');
  if (fs.existsSync(envFilePath)) {
    const envFileContents = fs.readFileSync(envFilePath, 'utf8');
    const parsedEnvFileContents = dotenv.parse(envFileContents);
    return parsedEnvFileContents;
  }
  return {};
}

function loadConfiguration() {
  const envFilePath = path.join(__dirname, RELATIVE_PATH_TO_AUTOGPT, '.env');
  if (fs.existsSync(envFilePath)) {
    const envFileContents = fs.readFileSync(envFilePath, 'utf8');
    const parsedEnvFileContents = dotenv.parse(envFileContents);
    const result = OBFUSCATE_ENV_VARS_BEFORE_SENDING_TO_CLIENT
      ? obfuscateObjectProperties(parsedEnvFileContents)
      : parsedEnvFileContents;
    return result;
  }
  return {};
}

////////////////

wss.on('connection', (socket) => {
  console.log(`Client connected, sending command log`);
  updateClients([socket]);
});

function updateClients(sockets, latestChunk = null) {
  if (sockets.length === 0) {
    sockets = wss.clients;
  }

  if (sockets.length === 0) {
    console.warn('No clients connected, not sending anything.');
    return;
  }

  const data = JSON.stringify({
    fullConsoleOutput: state.consoleOutputLines.join('\n'),
    latestChunk,
    configuration,
    state: {
      activeProcessRunning: !!state.activeProcess,
      activeCommandString: state.activeCommandString,
    },
  });

  for (const client of sockets) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

const appendOutputChunkAndUpdateClients = (data) => {
  function deleteLastLineIfCarrotMovedToBeginning() {
    const lastSavedLine =
      state.consoleOutputLines[state.consoleOutputLines.length - 1];
    if (!lastSavedLine?.endsWith('\r')) {
      return false;
    }

    state.consoleOutputLines.pop();
    return true;
  }

  const lines = data.split('\n');

  if (lines.length == 0) {
    return;
  }

  const [firstLine, ...restOfLines] = lines;

  const deletedLastLine = deleteLastLineIfCarrotMovedToBeginning();
  if (deletedLastLine) {
    state.consoleOutputLines.push(firstLine);
  } else {
    state.consoleOutputLines[state.consoleOutputLines.length - 1] =
      state.consoleOutputLines[state.consoleOutputLines.length - 1] + firstLine;
  }

  if (restOfLines.length > 0) {
    for (const line of restOfLines) {
      deleteLastLineIfCarrotMovedToBeginning();
      state.consoleOutputLines.push(line);
    }
  }

  updateClients(wss.clients, data);

  // console.log(`
  // Added ${lines.length} lines from data: ${data} resulting in ${commandLog.length} lines.
  // Last line: ${commandLog[commandLog.length - 1]}.
  // Sending to ${wss.clients.size} clients.
  // Full thing: ${commandLog}`);
};

app.use(express.json());

app.post('/execute', (req, res) => {
  const { command, inputs } = req.body;

  console.log(`Received command: ${command}`);

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  if (state.activeProcess) {
    return res
      .status(400)
      .json({ error: 'Another command is already running.' });
  }

  state.consoleOutputLines.push('\n');
  state.consoleOutputLines.push('[[COMMAND]] ' + command);
  state.consoleOutputLines.push('\n');

  const options = { cwd: RELATIVE_PATH_TO_AUTOGPT };

  state.activeCommandString = command;
  state.activeProcess = exec(command, options, (error) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
    }
  });

  state.activeProcess.stdout.on('data', appendOutputChunkAndUpdateClients);
  state.activeProcess.stderr.on('data', appendOutputChunkAndUpdateClients);

  state.activeProcess.stdout.on('data', (data) => process.stdout.write(data));
  state.activeProcess.stderr.on('data', (data) =>
    console.log(`💔 Error: ${data}`),
  );

  state.activeProcess.stderr.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
    state.activeProcess = null;
    state.activeCommandString = null;
    updateClients(wss.clients);
  });

  if (inputs?.length > 0) {
    for (const input of inputs) {
      state.activeProcess.stdin.write(input + '\n');
    }
  }

  updateClients(wss.clients);

  res.status(200).json({ message: 'Command received, processing...' });
});

app.all('/clear', (req, res) => {
  state.consoleOutputLines.length = 0;
  updateClients(wss.clients);

  exec('cls');

  res.status(200).json({ message: 'Output cleared...' });
});

app.post('/input', (req, res) => {
  const { input } = req.body;

  if (input === undefined || input === null) {
    return res.status(400).json({ error: 'Input is required.' });
  }

  if (!state.activeProcess) {
    return res.status(400).json({ error: 'No command is currently running.' });
  }

  console.log(`Sending input to active process: ${input}`);

  state.activeProcess.stdin.write(input + '\n');
  res.status(200).json({ message: 'Input sent to the active command.' });
});

app.all('/kill', (req, res) => {
  if (!state.activeProcess) {
    return res.status(400).json({ error: 'No command is currently running.' });
  }

  console.log('Killing active process...');

  kill(state.activeProcess.pid, 'SIGTERM', (err) => {
    if (err) {
      console.error('Error while killing the process:', err);
      return res.status(500).json({ error: 'Failed to kill the process.' });
    }
    state.activeProcess = null;
    res.status(200).json({ message: 'Active command killed.' });
  });
});

app.post('/setenv', (req, res) => {
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({ error: 'Key and value are required.' });
  }

  const envFilePath = path.join(__dirname, RELATIVE_PATH_TO_AUTOGPT, '.env');

  // Check if the .env file exists, create it if not
  if (!fs.existsSync(envFilePath)) {
    fs.writeFileSync(envFilePath, '');
  }

  // Read the contents of the .env file and parse it
  const envFileContents = fs.readFileSync(envFilePath, 'utf8');
  const envVars = dotenv.parse(envFileContents);

  // Update the env variable or add a new one
  envVars[key] = value;

  // Convert the envVars object back to a string
  const updatedEnvFileContents = Object.entries(envVars)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  // Write the updated contents back to the .env file
  fs.writeFileSync(envFilePath, updatedEnvFileContents);

  // Reload the configuration
  configuration = loadConfiguration();

  // Update clients with the new configuration
  updateClients(wss.clients);

  res.status(200).json({ message: 'Environment variable set.' });
});

app.post('/applyprofile', (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Data is required.' });
  }

  try {
    const yamlString = yaml.dump(data);
    const pathToSettingsFile = path.join(
      __dirname,
      RELATIVE_PATH_TO_AUTOGPT,
      PATH_TO_AI_SETTINGS_FILE,
    );
    fs.writeFileSync(pathToSettingsFile, yamlString, 'utf8');
    res.status(200).json({ message: 'AI profile saved to ai_settings.yml.' });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error saving AI profile: ${error.message}` });
  }
});

app.use((error, req, res, next) => {
  console.error(`Error: ${error.message}`);
  res.status(error.status || 500).json({ error: error.message });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle the upgrade request
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

//////
