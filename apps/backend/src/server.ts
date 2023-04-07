import express, { Request, Response } from 'express';
import cors from 'cors';
import { exec, ExecException } from 'child_process';
import WebSocket from 'ws';

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 2200;
const RELATIVE_PATH_TO_AUTOGPT = '../../auto-gpt';

// Initialize a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

let activeCommand: ReturnType<typeof exec> | null = null;
let commandLog: string[] = [];

wss.on('connection', socket => {
  console.log(`Client connected, sending command log`);
  updateClients([socket]);
});

function updateClients(sockets?: Iterable<WebSocket.WebSocket>, latestChunk: null | string = null) {
  if (sockets === undefined) {
    sockets = wss.clients;
  }

  for (const client of sockets) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          fullConsoleOutput: commandLog.join('\n'),
          latestChunk,
        })
      );
    }
  }
}

function appendOutputChunkAndUpdateClients(data: string) {
  function deleteLastLineIfCarrotMovedToBeginning() {
    const lastSavedLine = commandLog[commandLog.length - 1];
    if (!lastSavedLine?.endsWith('\r')) {
      return false;
    }

    commandLog.pop();
    return true;
  }

  const lines = data.split('\n');

  if (lines.length == 0) {
    return;
  }

  const [firstLine, ...restOfLines] = lines;

  const deletedLastLine = deleteLastLineIfCarrotMovedToBeginning();
  if (deletedLastLine) {
    commandLog.push(firstLine);
  } else {
    commandLog[commandLog.length - 1] = commandLog[commandLog.length - 1] + firstLine;
  }

  if (restOfLines.length > 0) {
    for (const line of restOfLines) {
      deleteLastLineIfCarrotMovedToBeginning();
      commandLog.push(line);
    }
  }

  updateClients(wss.clients, data);

  // console.log(`
  // Added ${lines.length} lines from data: ${data} resulting in ${commandLog.length} lines.
  // Last line: ${commandLog[commandLog.length - 1]}.
  // Sending to ${wss.clients.size} clients.
  // Full thing: ${commandLog}`);
}

app.use(express.json());

app.post('/execute', (req, res) => {
  const { command } = req.body;

  console.log(`Received command: ${command}`);

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  if (activeCommand) {
    return res.status(400).json({ error: 'Another command is already running.' });
  }

  commandLog.length = 0;
  updateClients();

  // Set the cwd option to the desired directory
  const options = { cwd: RELATIVE_PATH_TO_AUTOGPT };

  activeCommand = exec(command, options, error => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
    }
    activeCommand = null;
  });

  if (!activeCommand.stdout || !activeCommand.stderr) {
    console.error('Failed to get stdout or stderr.');
    return res.status(500).json({ error: 'Failed to get stdout or stderr.' });
  }

  activeCommand.stdout.on('data', appendOutputChunkAndUpdateClients);
  activeCommand.stderr.on('data', appendOutputChunkAndUpdateClients);
  activeCommand.stderr.on('data', data => process.stdout.write(data));

  res.status(200).json({ message: 'Command received, processing...' });
});

app.post('/input', (req, res) => {
  const { input } = req.body;

  if (input === undefined || input === null) {
    return res.status(400).json({ error: 'Input is required.' });
  }

  if (!activeCommand) {
    return res.status(400).json({ error: 'No command is currently running.' });
  }

  activeCommand.stdin?.write(input + '\n');
  res.status(200).json({ message: 'Input sent to the active command.' });
});

app.all('/kill', (req, res) => {
  if (!activeCommand) {
    return res.status(400).json({ error: 'No command is currently running.' });
  }

  activeCommand.kill();
  activeCommand = null;
  res.status(200).json({ message: 'Active command killed.' });
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

  res.status(200).json({ message: 'Environment variable set.' });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle the upgrade request
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});
