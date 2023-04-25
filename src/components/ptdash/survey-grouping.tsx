import { Box, Container, HStack, Text } from '@chakra-ui/react';

export interface Props {
  dueDate: string;
  grouping: string;
}

export const SurveyGrouping: React.FC<Props> = ({ dueDate, grouping }) => {
  return (
    <Container
      bg="gray.50"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <HStack spacing="4" py="4">
        <Box w="100%">
          <Text align="left">{grouping}</Text>
        </Box>

        <Box w="60%">
          <Text align="right">{dueDate}</Text>
        </Box>
      </HStack>
    </Container>
  );
};
