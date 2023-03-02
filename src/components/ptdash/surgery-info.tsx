import {
    HStack,
    Box,
    Heading,
    Text,
    Divider,
    Container,
    Progress,
    Spacer
  } from "@chakra-ui/react";
  
  export const SurgeryInfo = () => {
    return (
      <>
        <Container minW="400px" maxW="400px" bg="grey" color="#262626" borderWidth='1px' borderRadius='lg' overflow='hidden'>
          <Box bg="grey" color="white" w="100%" >
            <Heading pt="10px" pb="20px">
              <Text>Your Surgery</Text>
            </Heading>
            <Divider />
            <HStack spacing="24px" pt="24px">
              <Box w="40%" h="40px">
                <Text align="left">Operation Date:</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="left">MMM DD, YYYY</Text>
              </Box>
            </HStack>
            <HStack spacing="24px">
              <Box w="40%" h="40px">
                <Text align="left">Hospital:</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="left">Lorem Med Center</Text>
              </Box>
            </HStack>
            <HStack spacing="24px" >
              <Box w="40%" h="40px">
                <Text align="left">Surgeon:</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="left">Dr. Ipsum</Text>
              </Box>
            </HStack>
            <Divider/>
            <Spacer pb="24px"/>
            <Progress value={80} />
            <Text># / 12 Months Observation</Text>
            <Spacer pt="24px"/>
          </Box>
        </Container>
      </>
    );
  };
  