import APIService from '../services/APIService';
import { useToastShortcuts } from './useToastShortcuts';

export function useApiService() {
  const { toastBackendError } = useToastShortcuts();

  const apiService = new APIService();
  apiService.onError = toastBackendError;

  return apiService;
}
