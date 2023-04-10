import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AIProfile } from '../entities/AIProfile';

interface EditAIProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (profile: AIProfile) => void;
  initialValues: AIProfile;
  isCreatingNewProfile: boolean;
}

export const EditAIProfileModal: React.FC<EditAIProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues,
  isCreatingNewProfile,
}) => {
  const [profile, setProfile] = useState<AIProfile>(initialValues);

  useEffect(() => {
    setProfile({ ...initialValues });
    updateGoals();
  }, [initialValues.uid]);

  const updateGoals = (modifyBoforeSaving?: (goals: string[]) => string[]) => {
    let goals = [...profile.goals];
    if (modifyBoforeSaving) {
      goals = modifyBoforeSaving(goals);
    }
    while (goals[goals.length - 1] === '') goals.pop();
    goals.push('');
    setProfile({ ...profile, goals });
  };

  const setGoal = (index: number, value: string) => {
    updateGoals((goals) => {
      goals[index] = value;
      return goals;
    });
  };

  const handleSave = () => {
    profile.goals = profile.goals.filter((goal) => goal !== '');
    onSave?.(profile);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isCreatingNewProfile ? 'New' : 'Edit'} AI Profile
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align='stretch' spacing={4}>
            <FormControl>
              <FormLabel>Name your AI</FormLabel>
              <Input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder='Entrepreneur-GPT'
              />
            </FormControl>
            <FormControl>
              <FormLabel>Describe your AI's Role</FormLabel>
              <Textarea
                value={profile.role}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
                placeholder='An AI designed to autonomously develop and run businesses with the sole goal
  of increasing your net worth.'
              />
            </FormControl>
            <FormControl>
              <FormLabel>Goals for your AI</FormLabel>
              <VStack align='stretch' spacing={2}>
                {profile.goals.map((goal, index) => (
                  <Textarea
                    key={index}
                    value={goal}
                    onChange={(e) => setGoal(index, e.target.value)}
                    onBlur={() => updateGoals()}
                    size='sm'
                  />
                ))}
              </VStack>
            </FormControl>
          </VStack>
        </ModalBody>
        {onSave && (
          <>
            <ModalFooter>
              <Button colorScheme='blue' onClick={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
