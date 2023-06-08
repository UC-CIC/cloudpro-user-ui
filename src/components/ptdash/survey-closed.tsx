import { useNavigate } from 'react-router-dom';
import { Link } from '@chakra-ui/react'

import { Box, Container, HStack, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

export interface Props {
  description: string;
  missed: boolean;
  sid: string;
  duedate:string;
}

export const SurveyClosed: React.FC<Props> = ( props ) => {
  const navigate = useNavigate();

  // Navigate the user to the survey
  const showAudit = async () => {
    const stateHash = props.sid + props.duedate;
    navigate(`/audit/${stateHash}`);
  };

  return (
    <Container>
      <HStack spacing="10" py="2">
        {props.missed ? <CloseIcon /> : <CheckIcon />}
        <Box>
          <Link onClick={showAudit} >{props.description}</Link>
        </Box>
      </HStack>
    </Container>
  );
};
