import {
    HStack,
    Box,
    Text,
    Container,
    Button
  } from "@chakra-ui/react";
  
  import { CheckIcon, CloseIcon } from '@chakra-ui/icons'


  export const SurveyClosed = () => {
    return (
      <>
        <Container minW="420px" >
          <Box w="100%" >
            <HStack spacing="24px" pt="24px">
            <CheckIcon/>
              <Box w="100%"  bg="tan">
                <Text align="left">Survey Type Name</Text>
              </Box>
            </HStack>
          </Box>
        </Container>
      </>
    );
  };
  