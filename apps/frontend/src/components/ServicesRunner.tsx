import { useRemoteConsoleOutput } from "../hooks/useRemoteConsoleOutput";
import useWebSocketConnection from "../hooks/useWebSocketConnection";

export function ServicesRunner() {
  const socket = useWebSocketConnection('ws://localhost:2200');
  useRemoteConsoleOutput(socket);
  return null;
}
