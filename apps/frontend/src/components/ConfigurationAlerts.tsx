import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

export function ConfigurationAlerts() {
  function AlertBox(props: {
    title: string;
    description: string;
    status: 'error' | 'info' | 'warning' | 'success' | 'loading';
  }) {
    const { title, description, status } = props;
    return (
      <Alert status={status}>
        <AlertIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {/* {alerts.map((alert, index) => (
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Your browser is outdated!</AlertTitle>
          <AlertDescription>Your Chakra experience may be degraded.</AlertDescription>
        </Alert>
      ))} */}
    </>
  );
}
