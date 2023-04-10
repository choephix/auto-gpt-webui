import { useToast } from '@chakra-ui/react';

export function useToastShortcuts() {
  const toast = useToast();

  return {
    toastError: (e: string | Error) => {
      if (e instanceof Error) {
        e = e.message;
      }

      toast({
        title: 'Error',
        status: 'error',
        duration: 2000,
        isClosable: true,
        description: e,
        position: 'top',
      });
    },
    toastBackendError: (e: string | Error) => {
      if (e instanceof Error) {
        e = e.message;
      }

      toast({
        title: 'Backend Error',
        status: 'error',
        duration: 2000,
        isClosable: true,
        description: e,
        position: 'top',
      });
    },
  };
}
