import { Box, Container, HStack, Text } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

export interface Props {
  description: string;
  missed: boolean;
}

export const SurveyClosed: React.FC<Props> = ({ description, missed }) => {
  return (
    <Container>
      <HStack spacing="10" py="2">
        {missed ? <CloseIcon /> : <CheckIcon />}
        <Box>
          <Text align="left">{description}</Text>
        </Box>
      </HStack>
    </Container>
  );
};
