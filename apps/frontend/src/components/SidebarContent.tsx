import { Button, Divider, Heading, VStack } from '@chakra-ui/react';
import { APIService } from '../services/APIService';

const exeActions = [
  'ls -la',
  `pip install -r requirements.txt`,
  `python scripts/main.py`,
  `bash ../scripts/mock-spinner.sh`,
  `bash ../scripts/mock-user-input.sh`,
];

const apiService = new APIService();

export function SidebarContent() {
  function execc(command: string) {
    apiService.startCommand(command);
  }

  function sendInput(input: string) {
    apiService.sendInput(input);
  }

  function killProcess() {
    apiService.killProcess();
  }

  async function updateEnvVariable(key: string) {
    const value = prompt(`Enter value for ${key}:`);
    if (value !== null) {
      return await apiService.setEnvVariable(key, value);
    }
  }

  const ButtonList = (props: { actions?: [string, () => void][]; children?: React.ReactNode }) => {
    return (
      <VStack w='full' spacing={2}>
        {props.actions?.map(([label, func], index) => (
          <Button
            key={index}
            w='full'
            onClick={func}
            justifyContent='flex-start'
            textAlign={'left'}
            // textOverflow={'ellipsis'}
            // overflow={'hidden'}
            whiteSpace={'pre-wrap'}
            h={'auto'}
            py={2}
          >
            {label}
          </Button>
        ))}
        {props.children || null}
      </VStack>
    );
  };

  return (
    <VStack align='start' spacing={6} padding={3}>
      {/* <Text fontSize='2xl' fontFamily='monospace' fontWeight='bold'>
        Logo
      </Text> */}

      <Heading size='md'>Environment Variables</Heading>
      <ButtonList
        actions={[
          ['Set OpenAI API Key', () => updateEnvVariable('OPENAI_API_KEY')],
          ['Set Google API Key', () => updateEnvVariable('GOOGLE_API_KEY')],
          ['Set Custom Search Engine ID', () => updateEnvVariable('CUSTOM_SEARCH_ENGINE_ID')],
        ]}
      />

      <Divider />

      <Heading size='md'>Actions</Heading>
      <ButtonList actions={exeActions.map(action => [`exec:\n${action}`, () => execc(action)])} />

      <ButtonList
        actions={[
          ['Kill', killProcess],
          ['Clear Console', () => sendInput('cls')],
        ]}
      />

      <Divider />

      <Heading size='md'>Input</Heading>
      <ButtonList
        actions={[
          ['Send "y"', () => sendInput('y')],
          ['Send "Jonkata"', () => sendInput('Jonkata')],
          ['Send "Joke"', () => sendInput('Come up with a funny joke')],
          ['Send "⏎"', () => sendInput('')],
        ]}
      />
    </VStack>
  );
}
