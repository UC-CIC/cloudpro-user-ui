import { useQuery } from 'react-query';
import { Stack } from '@chakra-ui/react';

import PatientProfile from './PatientProfile/PatientProfile';
import Loader from '../components/Loader/Loader';
import { PtNav } from '../components/ptdash/pt-nav';
import { useAuth } from '../hooks/useAuth';
import React from 'react';
import {
  getUserProfile,
  PatientProfile as PatientProfileType,
} from '../services/message.service';

const PatientHome: React.FC = () => {
  const auth = useAuth();

  const { data: profile, isLoading } = useQuery('patientProfile', async () => {
    const token = await auth.getAccessToken();
    const { data, error } = await getUserProfile(auth.sub, token);
    if (!data && error) throw error;
    return data as PatientProfileType;
  });

  if (isLoading || !profile)
    return (
      <Stack mt="32" align="center">
        <Loader />
      </Stack>
    );

  return ['INIT', 'STAGED'].indexOf(profile.state.toUpperCase()) > -1 ? (
    <PatientProfile profile={profile} />
  ) : (
    <PtNav
      hospital={profile.profile.hospital}
      surgeon={profile.profile.surgeon}
      surgdate={profile.profile.surgeryDate}
    />
  );
};

export default PatientHome;
