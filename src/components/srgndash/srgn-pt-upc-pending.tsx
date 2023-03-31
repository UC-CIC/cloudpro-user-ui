import {
    HStack,
    Box,
    Text,
    Container,
    Button
  } from "@chakra-ui/react";


  export const SrgnUpcomingPending: React.FC = () => {
    return (
      <>
        <Container minW="420px" >
          <Box w="100%" >
            <HStack spacing="24px" pt="24px">
              <Box w="100%"  bg="tan">
                <Text align="left">Pre-op survey results pending</Text>
              </Box>
            </HStack>
          </Box>
        </Container>
      </>
    );
  };
  