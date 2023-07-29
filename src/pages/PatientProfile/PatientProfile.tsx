import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import {
  Box,
  Container,
  Fade,
  Heading,
  ScaleFade,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

import PatientProfileBase from './PatientProfileBase';
import PatientProfileChallenges from './PatientProfileChallenges';
import PatientProfileMfa from './PatientProfileMfa';
import Loader from '../../components/Loader/Loader';
import { PageLayout } from '../../components/page-layout';
import { useAuth } from '../../hooks/useAuth';
import { camelToSnakeCase, mapObjectKeys } from '../../services/helpers';
import {
  PatientProfile as PatientProfileType,
  updateProfile as updatePatientProfile,
} from '../../services/message.service';

export interface Props {
  onSetup: () => any;
  profile: PatientProfileType;
}

const PatientProfile: React.FC<Props> = ({ onSetup, profile }) => {
  const auth = useAuth();
  const [step, setStep] = useState(1);

  const {
    isLoading: isSubmitting,
    isSuccess,
    mutate: updateProfile,
  } = useMutation({
    // Submit updates
    mutationFn: async (data: Partial<PatientProfileType>) => {
      const token = await auth.getAccessToken();
      await updatePatientProfile(data, token);
    },
    // Revert back to the last step
    onError: () => setStep(step - 1),
    onSuccess: onSetup,
  });

  // Initialize forms
  const [baseProfile, setBaseProfile] = useState({
    ...profile.profile,
  } as PatientProfileType['profile']);
  const [challengeQs, setChallengeQs] = useState({
    ...profile.challenge,
  } as PatientProfileType['challenge']);
  const [tfa, setTfa] = useState({ tfa: profile.tfa });

  // Update the active step
  const handleStepChange = (stepSize: number) => setStep(step + stepSize);

  // Submit the form once the user has completed all steps
  useEffect(() => {
    if (step < 4) return;
    updateProfile({
      challenge: challengeQs,
      email: auth.username,
      profile: mapObjectKeys(baseProfile, camelToSnakeCase),
      sub: auth.sub,
      state: 'COMPLETE',
      tfa: tfa.tfa,
    });
  }, [auth, baseProfile, challengeQs, step, tfa, updateProfile]);

  const backgroundColor = useColorModeValue("white", "blue.500");

  return (
    <PageLayout>
      <Container maxW="5xl">
        {isSubmitting || isSuccess ? (
          // Display submitting screen iff updates are being submitted
          <Stack textAlign="center" align="center" spacing="2">
            <ScaleFade in initialScale={0.9}>
              <Loader />
            </ScaleFade>
            <Fade in>
              <Text>Processing</Text>
            </Fade>
          </Stack>
        ) : (
          // Display the form
          <Stack
            textAlign="center"
            flexDir="column"
            align="center"
            alignItems="center"
          >
            <Heading color="teal" mb="6" fontSize="3xl">
              {profile.state === 'INIT'
                ? 'Profile Setup'
                : 'Profile Confirmation'}{' '}
              ({Math.min(step, 3)}/3)
            </Heading>

            <Box minW={{ base: '90%', md: '468px' }} backgroundColor={backgroundColor}>
              {profile.state !== 'INIT' && (
                <Box bg="teal" w="100%" py={8} px={4} color="white">
                  <Text color="white" mb="1.5">
                    Congrats! Staff have already set your profile up and you are
                    ready to go.
                  </Text>
                  <Text color="white">
                    Please confirm your information on the following screens.
                  </Text>
                </Box>
              )}

              <Stack spacing={4} p="1rem" boxShadow="md">
                {step === 1 && (
                  <Fade in>
                    <PatientProfileBase
                      initialValues={baseProfile}
                      onStepChange={handleStepChange}
                      onSubmit={setBaseProfile}
                    />
                  </Fade>
                )}

                {step === 2 && (
                  <Fade in>
                    <PatientProfileChallenges
                      initialValues={challengeQs}
                      onStepChange={handleStepChange}
                      onSubmit={setChallengeQs}
                    />
                  </Fade>
                )}

                {step === 3 && (
                  <Fade in>
                    <PatientProfileMfa
                      initialValues={tfa}
                      onStepChange={handleStepChange}
                      onSubmit={setTfa}
                    />
                  </Fade>
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </Container>
    </PageLayout>
  );
};

export default PatientProfile;
