import React from 'react';
import { GUI } from './GUI';
import useWebSocket from './useWebSocket';

import './App.css';

function App() {
  const socket = useWebSocket('ws://localhost:2200');

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return <GUI socket={socket} />;
}

export default App;
