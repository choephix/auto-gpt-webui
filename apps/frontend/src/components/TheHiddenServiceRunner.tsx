import { getBackendSocketUrl } from '../config/BackendUrl';
import { useRemoteConsoleOutput } from '../hooks/useRemoteConsoleOutput';
import { useUpdateLocalStorage } from '../hooks/useUpdateLocalStorage';
import useWebSocketConnection from '../hooks/useWebSocketConnection';

export function ServicesRunner() {
  const socket = useWebSocketConnection(getBackendSocketUrl());
  useRemoteConsoleOutput(socket);
  useUpdateLocalStorage();
  return null;
}
