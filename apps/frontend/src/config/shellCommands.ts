export const SHELL_COMMANDS = {
  installRequirements: 'pip install -r requirements.txt',
  startAutoGPT: 'python scripts/main.py',
  testLsLa: 'ls -la',
  testMockSpinner: `bash ../scripts/mock-spinner.sh`,
  testMockUserInput: `bash ../scripts/mock-user-input.sh`,
} satisfies Record<string, string>;
