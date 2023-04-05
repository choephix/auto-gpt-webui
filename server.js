const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const WebSocket = require('ws');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 2200;

// Initialize a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

let activeCommand = null;

wss.on('connection', ws => {
  if (activeCommand) {
    activeCommand.stdout.on('data', data => {
      ws.send(data);
    });

    activeCommand.stderr.on('data', data => {
      ws.send(data);
    });

    activeCommand.on('exit', code => {
      ws.send(`\nProcess exited with code ${code}\n`);
      ws.close();
    });
  }
});

app.use(express.json());

app.post('/execute', (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  if (activeCommand) {
    return res.status(400).json({ error: 'Another command is already running.' });
  }

  activeCommand = exec(command, error => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
    }
    activeCommand = null;
  });

  res.status(200).json({ message: 'Command received, processing...' });
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
