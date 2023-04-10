import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Code,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Spacer,
  Switch,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import { BackendConfigurationKeys } from '../config/BackendConfigurationKeys';
import { useApiService } from '../hooks/useApiService';
import { useAutoGPTStarter } from '../hooks/useAutoGPTStarter';
import { useContextStore } from '../store/useContextStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { EditIcon } from '@chakra-ui/icons';

export function SettingsDrawerContent() {
  return (
    <VStack align='start' spacing={6} padding={3}>
      <SettingToggles />

      <Divider />
      <EnvVars />

      <Divider />
      <DebuggingView />
    </VStack>
  );
}

function SettingToggles() {
  const {
    autoContinuous,
    autoDebugMode,
    autoWithOnlyGPT3,
    setAutoContinuous,
    setAutoDebugMode,
    setAutoWithOnlyGPT3,
  } = useSettingsStore();
  const { backendState } = useContextStore();

  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';

  function SettingControl_Toggle({
    label,
    value,
    setValue,
    disableOnActiveProcess,
  }: {
    label: string;
    value: boolean;
    setValue: (value: boolean) => void;
    disableOnActiveProcess?: boolean;
  }) {
    return (
      <FormControl
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <FormLabel htmlFor={label} mb='0' fontSize='xs' flexGrow='1'>
          <b>{label}</b>
        </FormLabel>
        <Switch
          id={label}
          isChecked={value}
          isDisabled={
            disableOnActiveProcess && backendState?.activeProcessRunning
          }
          onChange={() => setValue(!value)}
        />
      </FormControl>
    );
  }

  return (
    <>
      <Heading size='md'>Appearance</Heading>

      <SettingControl_Toggle
        label={`${isDarkMode ? '🌜' : '🌞'} Dark mode`}
        value={isDarkMode}
        setValue={toggleColorMode}
      />

      <Heading size='md'>Backend script settings</Heading>

      <SettingControl_Toggle
        label='😢 Use only GPT-3.5 (no GPT-4)'
        value={autoWithOnlyGPT3}
        setValue={setAutoWithOnlyGPT3}
      />
      <SettingControl_Toggle
        label='💀 Use continuous mode'
        value={autoContinuous}
        setValue={setAutoContinuous}
      />
      <SettingControl_Toggle
        label='🐛 Use debug mode'
        value={autoDebugMode}
        setValue={setAutoDebugMode}
      />
    </>
  );
}

function EnvVars() {
  const apiService = useApiService();
  const { backendConfiguration } = useContextStore();

  if (!backendConfiguration) return null;

  type BackendConfigurationKey = keyof typeof backendConfiguration;

  async function promptAndUpdateEnvVariable(key: string) {
    const value = prompt(`Enter value for ${key}:`);
    if (value !== null) {
      return await apiService.setEnvVariable(key, value);
    }
  }

  function renderAlert(
    key: string,
    status: 'success' | 'error' | 'info' | 'warning',
    isRequired: boolean,
    isSetUp: boolean,
  ) {
    function getTitleSuffix() {
      if (isSetUp)
        return (
          <Box as='span' fontWeight='normal' textStyle='italic'>
            <>is set up.</>
          </Box>
        );
      if (isRequired) return <>is missing!</>;
      return (
        <>
          <Box as='span' fontWeight='normal' textStyle='italic'>
            isn't set up (optional)
          </Box>
        </>
      );
    }

    return (
      <Alert
        key={key}
        borderRadius='xl'
        variant={isSetUp || !isRequired ? 'subtle' : 'solid'}
        status={status}
        pointerEvents='all'
      >
        <AlertIcon />
        <AlertTitle>
          <code>{key}</code> {getTitleSuffix()}
        </AlertTitle>
        <Spacer />
        <IconButton
          icon={<EditIcon />}
          aria-label={'edit-env-var'}
          variant='ghost'
          onClick={() => promptAndUpdateEnvVariable(key)}
        ></IconButton>
      </Alert>
    );
  }

  function getKeyRenderPriority(key: BackendConfigurationKey) {
    const isSetUp = Boolean(backendConfiguration?.[key]);
    const isRequired = BackendConfigurationKeys[key] === 'required';
    return isSetUp ? -1 : isRequired ? 1 : 0;
  }

  return (
    <>
      <Heading size='md'>Environment Variables</Heading>

      {Object.entries(BackendConfigurationKeys)
        .sort(([keyA], [keyB]) => {
          const a = getKeyRenderPriority(keyA as BackendConfigurationKey);
          const b = getKeyRenderPriority(keyB as BackendConfigurationKey);
          return b - a;
        })
        .map(([key, need]) => {
          const isSetUp = Boolean(
            backendConfiguration?.[key as BackendConfigurationKey],
          );
          const isRequired = need === 'required';

          if (isSetUp) {
            return renderAlert(key, 'success', isRequired, true);
          } else if (!isRequired) {
            return renderAlert(key, 'info', false, false);
          } else {
            return renderAlert(key, 'error', true, false);
          }
        })}
    </>
  );
}

function DebuggingView() {
  const apiService = useApiService();
  const { backendState, backendConfiguration } = useContextStore();
  const { command } = useAutoGPTStarter();

  const debuggingShellCommands = [
    'ls -la',
    `bash ../scripts/mock-spinner.sh`,
    `bash ../scripts/mock-user-input.sh`,
    `bash ../scripts/mock-continuous.sh`,
    `pip install -r requirements.txt`,
    command, // `python scripts/main.py` + args,
  ];

  function runCommand(command: string) {
    apiService.startCommand(command);
  }

  async function updateEnvVariable(key: string) {
    const value = prompt(`Enter value for ${key}:`);
    if (value !== null) {
      return await apiService.setEnvVariable(key, value);
    }
  }

  const ButtonList = (props: {
    actions?: [string, () => void][];
    children?: React.ReactNode;
  }) => {
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

  const backendConfigurationExistance =
    backendConfiguration &&
    Object.fromEntries(
      Object.entries(backendConfiguration).map(([key, value]) => [
        key,
        Boolean(value),
      ]),
    );

  return (
    <>
      <Heading size='md'>Debugging</Heading>

      <Heading size='xs'>Shell Commands</Heading>
      <ButtonList
        actions={debuggingShellCommands.map((action) => [
          `exec:\n${action}`,
          () => runCommand(action),
        ])}
      />

      <Heading size='xs'>Backend State</Heading>
      <Code w='full' fontSize='11px' whiteSpace='pre-wrap' p='2'>
        {JSON.stringify(backendState, null, 2)}
      </Code>

      <Heading size='xs'>Backend Configuration</Heading>
      <Code w='full' fontSize='11px' whiteSpace='pre-wrap' p='2'>
        {JSON.stringify(backendConfigurationExistance, null, 2)}
      </Code>
    </>
  );
}
