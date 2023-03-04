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
  
  export interface Props {
    hospital: string;
    surgeon: string;
    surgdate: string;
  }
  

  export const SurgeryInfo: React.FC<Props> = (props)  => {
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
                <Text align="left">{props.surgdate}</Text>
              </Box>
            </HStack>
            <HStack spacing="24px">
              <Box w="40%" h="40px">
                <Text align="left">Hospital:</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="left">{props.hospital}</Text>
              </Box>
            </HStack>
            <HStack spacing="24px" >
              <Box w="40%" h="40px">
                <Text align="left">Surgeon:</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="left">{props.surgeon}</Text>
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
  