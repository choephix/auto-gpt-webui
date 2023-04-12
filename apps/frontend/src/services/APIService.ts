export class APIService {
  public onError?: (error: string) => void;

  constructor(private readonly baseUrl: string) {}

  private async fetchWrapper(
    endpoint: string,
    method: string = 'POST',
    body?: Record<string, unknown>,
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
      if (data.error) {
        throw new Error(data.error);
      }

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return data;
    } catch (error) {
      console.error(`Error during fetch for ${endpoint}:`, error);
      this.onError?.(String(error));
    }
  }

  startCommand(command: string, preconfiguredInputs?: string[]) {
    return this.fetchWrapper('execute', 'POST', {
      command,
      inputs: preconfiguredInputs,
    });
  }

  clearOutput() {
    return this.fetchWrapper('clear', 'POST');
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

  applyAiProfile(settings: {
    ai_name: string;
    ai_role: string;
    ai_goals: string[];
  }) {
    return this.fetchWrapper('applyprofile', 'POST', { data: settings });
  }
}

export default APIService;
