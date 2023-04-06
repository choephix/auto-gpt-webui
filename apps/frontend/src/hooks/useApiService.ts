import APIService from '../services/APIService';
import { useToastShortcuts } from './useToastShortcuts';

export function useApiService() {
  const { toastError } = useToastShortcuts();

  const apiService = new APIService();
  apiService.onError = toastError;

  return apiService;
}
