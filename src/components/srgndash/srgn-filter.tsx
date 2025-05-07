import {
    HStack,
    Box,
    Text,
    Container,
    Button
  } from "@chakra-ui/react";


  export const SrgnFilter: React.FC = () => {
    return (
      <>
        <Container minW="420px" >
          <Box w="100%" >
            <HStack spacing="24px" pt="24px">
              <Button>Filter</Button>
            </HStack>
          </Box>
        </Container>
      </>
    );
  };
  