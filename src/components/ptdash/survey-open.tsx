import { useNavigate } from 'react-router-dom';
import { Button, Box, HStack, Text, Container } from '@chakra-ui/react';

export interface Props {
  description: string;
  sid: string;
  propack: string;
  duedate: string;
}

export const SurveyOpen: React.FC<Props> = (props) => {
  const navigate = useNavigate();

  // Navigate the user to the survey
  const beginSurvey = async () => {
    const stateHash = props.sid + props.duedate;
    navigate(`/survey/${props.propack}/${stateHash}`);
  };

  return (
    <Container pl="1" pr="2">
      <HStack spacing="10" py="2">
        <Box>
          <Text align="left" fontWeight="normal">
            {props.description}
          </Text>
        </Box>
        <Box>
          <Button onClick={beginSurvey}>Begin Survey</Button>
        </Box>
      </HStack>
    </Container>
  );
};
