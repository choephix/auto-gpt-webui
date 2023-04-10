import {
  AddIcon,
  CheckCircleIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Divider,
  Grid,
  GridItem,
  IconButton,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useState } from 'react';
import { AIProfile } from '../entities/AIProfile';
import { useAutoGPTStarter } from '../hooks/useAutoGPTStarter';
import { useSettingsStore } from '../store/useSettingsStore';
import { getPseudoRandomColorFromString } from '../utils/getPseudoRandomColorFromString';
import { getRandomProfileDataFiller } from '../utils/getRandomProfileDataFiller';
import { EditAIProfileModal } from './EditAIProfileModal';

interface AIProfileCardProps {
  profile: AIProfile;
  ctrl: {
    delete: () => void;
    choose: () => void;
    edit: () => void;
  };
}

function MenuCard({ children, ...rest }: any) {
  return (
    <Box
      borderWidth='1px'
      borderRadius='lg'
      p={4}
      bg='white'
      h='full'
      alignItems='center'
      className='FancyBox'
      transition={'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'}
      boxShadow={
        'inset 0 0 127px rgba(255, 191, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }
      _hover={{
        transform: 'scale(1.05)',
        boxShadow:
          'inset 0 0 127px rgba(255, 191, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      userSelect='none'
      {...rest}
    >
      {children}
    </Box>
  );
}

function AIProfileCard({ profile, ctrl }: AIProfileCardProps) {
  return (
    <MenuCard minH='200px'>
      <VStack
        align='stretch'
        justifyContent='space-between'
        spacing={2}
        h='full'
      >
        <VStack
          align='stretch'
          justifyContent='space-between'
          spacing={2}
          h='full'
          cursor='pointer'
          onClick={ctrl.edit}
        >
          <Text fontSize='md' fontWeight='bolder'>
            {profile.name}
          </Text>
          <Text fontSize='sm' fontWeight='normal'>
            {profile.role}
          </Text>
          <Spacer />
          <Text fontSize='xs' fontStyle='italic'>
            {profile.goals.length} goal(s)
          </Text>
        </VStack>
        <Divider />
        <ButtonGroup>
          <IconButton
            size='sm'
            icon={<DeleteIcon />}
            aria-label='Delete AI Profile'
            onClick={ctrl.delete}
            variant='ghost'
            colorScheme='red'
          />
          <Button
            size='sm'
            leftIcon={<CheckIcon />}
            aria-label='Delete AI Profile'
            onClick={ctrl.choose}
            flexGrow={1}
            // variant='solid'
            variant='ghost'
            colorScheme='green'
          >
            Start this AI
          </Button>
          <IconButton
            size='sm'
            icon={<EditIcon />}
            aria-label='Delete AI Profile'
            onClick={ctrl.edit}
            variant='ghost'
            colorScheme='blue'
          />
        </ButtonGroup>
      </VStack>
      <Container
        position='absolute'
        top='0'
        right='0'
        w='fit-content'
        h='fit-content'
        px='20px'
        py='14px'
      >
        <CheckCircleIcon
          color={getPseudoRandomColorFromString(profile.uid)}
          boxSize={3}
        />
      </Container>
    </MenuCard>
  );
}

function AddAIProfileCard({ onClick }: { onClick: () => void }) {
  return (
    <MenuCard cursor='pointer' onClick={onClick}>
      <Center h='full' flexDirection='column'>
        <Text>&nbsp;</Text>
        <AddIcon mb='4' boxSize={5} />
        <Text>Add AI Profile</Text>
      </Center>
    </MenuCard>
  );
}

export function ListOfAIProfiles({
  showAddButton = false,
}: {
  showAddButton?: boolean;
}) {
  const { aiProfiles, setAiProfiles } = useSettingsStore();
  const {
    isOpen: isEditorOpen,
    onOpen: onEditorOpen,
    onClose: onEditorClose,
  } = useDisclosure();

  const [parent] = useAutoAnimate({
    duration: 200,
  });

  const [selectedProfile, setSelectedProfile] = useState<AIProfile | null>(
    null,
  );
  const { sendStartCommandWithProfile } = useAutoGPTStarter();

  const ensureProfileNameIsUnique = (profile: AIProfile) => {
    const existingProfile = aiProfiles.find((p) => p.name === profile.name);
    if (existingProfile) {
      let i = 1;
      while (true) {
        const newName = `${profile.name} (${i})`.trim();
        const existingProfile = aiProfiles.find((p) => p.name === newName);
        if (!existingProfile) {
          profile.name = newName;
          break;
        }
        i++;
      }
    }
  };

  const handleProfileSave = (profile: AIProfile) => {
    const isExistingProfile = aiProfiles.find((p) => p.uid === profile.uid);
    if (isExistingProfile) {
      setAiProfiles(
        aiProfiles.map((p) => (p.uid === profile.uid ? profile : p)),
      );
    } else {
      ensureProfileNameIsUnique(profile);
      setAiProfiles([profile, ...aiProfiles]);
    }
    onEditorClose();
  };

  const handleDeleteAIProfile = (index: number) => {
    const newProfiles = [...aiProfiles];
    newProfiles.splice(index, 1);
    setAiProfiles(newProfiles);
  };

  return (
    <>
      <Grid
        templateColumns='repeat(auto-fill, minmax(350px, 1fr))'
        gap={4}
        mb={4}
        ref={parent}
      >
        {showAddButton && (
          <GridItem key='+'>
            <AddAIProfileCard
              onClick={() => {
                const initialValues = getRandomProfileDataFiller();
                setSelectedProfile(initialValues);
                onEditorOpen();
              }}
            />
          </GridItem>
        )}
        {aiProfiles.map((profile, index) => (
          <GridItem key={profile.name}>
            <AIProfileCard
              key={profile.name}
              profile={profile}
              ctrl={{
                delete: () => {
                  handleDeleteAIProfile(index);
                },
                choose: () => {
                  sendStartCommandWithProfile(profile);
                },
                edit: () => {
                  setSelectedProfile(profile);
                  onEditorOpen();
                },
              }}
            />
          </GridItem>
        ))}
      </Grid>
      {selectedProfile && (
        <EditAIProfileModal
          key={selectedProfile.uid}
          isOpen={isEditorOpen}
          onClose={onEditorClose}
          onSave={handleProfileSave}
          initialValues={selectedProfile}
          isCreatingNewProfile={
            !aiProfiles.find((p) => p.uid === selectedProfile.uid)
          }
        />
      )}
    </>
  );
}
