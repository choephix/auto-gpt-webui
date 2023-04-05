const express = require('express');
const { exec } = require('child_process');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', ws => {
  ws.on('message', message => {
    const command = message.toString().trim();

    if (command) {
      const child = exec(command);

      child.stdout.on('data', data => {
        ws.send(data);
      });

      child.stderr.on('data', data => {
        ws.send(data);
      });

      child.on('exit', code => {
        ws.send(`\nProcess exited with code ${code}\n`);
        ws.close();
      });
    } else {
      ws.send('Invalid command.');
      ws.close();
    }
  });
});

app.use(express.json());

app.post('/execute', (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: 'Command is required.' });
  }

  // Upgrade the connection to a WebSocket connection
  const socket = new WebSocket('ws://localhost:3000');
  socket.on('open', () => {
    socket.send(command);
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
