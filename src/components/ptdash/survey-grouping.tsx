import {
    HStack,
    Box,
    Text,
    Container,
  } from "@chakra-ui/react";
  

  export interface Props {
    grouping: string;
  }

  
  export const SurveyGrouping: React.FC<Props> = (props)  => {
    return (
      <>
        <Container minW="420px" bg="purple" color="#262626" borderWidth='1px' borderRadius='lg' overflow='hidden'>
          <Box bg="purple" color="white" w="100%" >
            <HStack spacing="24px" pt="24px">
              <Box w="100%" h="40px">
                <Text align="left">{props.grouping}</Text>
              </Box>
              {/*
              <Box w="60%" h="40px">
                <Text align="right">Lorem</Text>
              </Box>*/}
            </HStack>
          </Box>
        </Container>
      </>
    );
  };
  