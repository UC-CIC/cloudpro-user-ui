import {
    HStack,
    Box,
    Text,
    Container,
  } from "@chakra-ui/react";
  
  export const SurveyGrouping = () => {
    return (
      <>
        <Container minW="420px" bg="purple" color="#262626" borderWidth='1px' borderRadius='lg' overflow='hidden'>
          <Box bg="purple" color="white" w="100%" >
            <HStack spacing="24px" pt="24px">
              <Box w="40%" h="40px">
                <Text align="left">xx Post Surgery</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="right">Lorem</Text>
              </Box>
            </HStack>
          </Box>
        </Container>
      </>
    );
  };
  