import { Button, Wrap } from '@chakra-ui/react';
import { SHELL_COMMANDS } from '../config/shellCommands';
import { APIService } from '../services/APIService';

const apiService = new APIService();

export function ActionBar() {
  function execc(command: string) {
    apiService.startCommand(command);
  }

  function killProcess() {
    apiService.killProcess();
  }

  const exeActions = [
    SHELL_COMMANDS.installRequirements,
    SHELL_COMMANDS.startAutoGPT,
    SHELL_COMMANDS.testLsLa,
    SHELL_COMMANDS.testMockSpinner,
    SHELL_COMMANDS.testMockUserInput,
  ];

  return (
    <Wrap>
      {exeActions.map((action, index) => (
        <Button key={index} onClick={() => execc(action)}>
          exec: {action}
        </Button>
      ))}
      <Button onClick={() => killProcess()}>Kill</Button>
    </Wrap>
    // <ButtonGroup>
    //   {exeActions.map((action, index) => (
    //     <Button key={index} onClick={() => execc(action)}>
    //       exec: {action}
    //     </Button>
    //   ))}
    //   <Button onClick={() => killProcess()}>Kill</Button>
    // </ButtonGroup>
  );
}
