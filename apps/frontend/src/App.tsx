import './App.css';
import { GUI } from './components/GUI';
import { SidebarContent } from './components/SidebarContent';
import SimpleSidebarWrapper from './components/SimpleSidebarWrapper';
import useWebSocketConnection from './hooks/useWebSocketConnection';

function App() {
  const socket = useWebSocketConnection('ws://localhost:2200');

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return (
    <SimpleSidebarWrapper sidebarContent={<SidebarContent />}>
      <GUI socket={socket} />
    </SimpleSidebarWrapper>
  );
}

export default App;
