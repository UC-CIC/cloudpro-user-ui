import React from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  HStack
} from "@chakra-ui/react";




export const SrgnCompliance: React.FC = () => {
  return (
    <Container minW="400px" maxW="400px" bg="grey" color="#262626" borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Box bg="grey" color="white" w="100%" >
            <Heading pt="10px" pb="20px">
              <Text>Your Surgery</Text>
            </Heading>
           
            <Box h="40px" w="100%">
              <Text textAlign={'center'}>My patient's survey response compliance</Text>
            </Box>
            <Box h="40px" w="100%">
              <Text textAlign={'center'}>90%</Text>
            </Box>
      
      </Box>
    </Container>
  );
};
