import { Box, Container, HStack, Text, useColorModeValue } from '@chakra-ui/react';

export interface Props {
  dueDate: string;
  grouping: string;
}

export const SurveyGrouping: React.FC<Props> = ({ dueDate, grouping }) => {

  const backgroundColor = useColorModeValue("gray.100", "gray.800");


  return (
    <Container
      bg={backgroundColor}
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
