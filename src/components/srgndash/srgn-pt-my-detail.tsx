import { HStack, Box, Text, Container, Button } from "@chakra-ui/react";

import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

export const SurgeonMyPtSurveyDetail: React.FC = () => {
  return (
    <>
      <Container minW="420px" bg="tan">
        <Box w="100%">
          <HStack spacing="24px" pt="24px">
            <CheckIcon />
            <Box w="100%">
              <Text align="left">Physical Functional Assessment</Text>
            </Box>
          </HStack>
          <HStack spacing="24px" pt="24px">
            <Box w="100%">
              <Text align="left">Latest Score: 88 (T-Score)</Text>
            </Box>
            <Box w="100%" h="40px">
              <Text align="left">Date Ipsum</Text>
            </Box>
          </HStack>
        </Box>
      </Container>

      <Container minW="420px" bg="tan">
        <Box w="100%">
          <HStack spacing="24px" pt="24px">
            <CloseIcon />
            <Box w="100%">
              <Text align="left">Physical Functional Assessment</Text>
            </Box>
          </HStack>
          <HStack spacing="24px" pt="24px">
            <Box w="100%">
              <Text align="left">Latest Score: N/A</Text>
            </Box>
            <Box w="100%" h="40px">
              <Text align="left">Missed</Text>
            </Box>
          </HStack>
        </Box>
      </Container>
    </>
  );
};
