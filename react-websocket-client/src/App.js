const express = require('express');
const http = require('http');
const { Server } = require('ws');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new Server({ server });

app.post('/execute', (req, res) => {
  const command = req.body.command;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ stdout, stderr });
  });
});

wss.on('connection', ws => {
  console.log('WebSocket connection established');

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  const handleMessage = command => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        ws.send(`Error: ${error.message}\n`);
        return;
      }

      if (stdout) ws.send(stdout);
      if (stderr) ws.send(stderr);
    });
  };

  ws.on('message', message => {
    handleMessage(message);
  });
});

server.listen(2200, () => {
  console.log('Server listening on port 2200');
});
