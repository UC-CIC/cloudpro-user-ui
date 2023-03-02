import {
    HStack,
    Box,
    Text,
    Container,
    Button
  } from "@chakra-ui/react";
  
  export const SurveyOpen = () => {
    return (
      <>
        <Container minW="420px" >
          <Box w="100%" >
            <HStack spacing="24px" pt="24px">
              <Box w="40%" h="40px">
                <Button>Begin Survey</Button>
              </Box>
              <Box w="60%"  bg="tan">
                <Text align="left">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</Text>
              </Box>
            </HStack>
          </Box>
        </Container>
      </>
    );
  };
  