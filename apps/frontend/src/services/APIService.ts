export class APIService {
  private readonly baseUrl: string;

  constructor() {
    const defaultUrl = 'http://localhost:2200';
    const envUrl = process.env.BACKEND_URL || '';
    const localStorageUrl = localStorage.getItem('backendUrl') || '';
    const urlParam = new URLSearchParams(window.location.search).get('api') || '';

    this.baseUrl = urlParam || localStorageUrl || envUrl || defaultUrl;
  }

  private async fetchWrapper(
    endpoint: string,
    method: string = 'POST',
    body?: Record<string, unknown>
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(`Error during fetch for ${endpoint}:`, error);
    }
  }

  startCommand(command: string) {
    return this.fetchWrapper('execute', 'POST', { command });
  }

  sendInput(input: string) {
    return this.fetchWrapper('input', 'POST', { input });
  }

  killProcess() {
    return this.fetchWrapper('kill', 'POST');
  }

  setEnvVariable(key: string, value: string) {
    return this.fetchWrapper('setenv', 'POST', { key, value });
  }
}

export default APIService;
