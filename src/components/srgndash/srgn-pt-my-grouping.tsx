import {
    HStack,
    Box,
    Text,
    Container,
  } from "@chakra-ui/react";
  
import { SurgeonMyPtSurveyDetail } from "./srgn-pt-my-detail";
import { SrgnUpcomingPending} from "./srgn-pt-upc-pending";


  export const SrgnMyPtGrouping: React.FC = ()  => {
    return (
      <>
        <Container minW="420px" bg="purple" color="#262626" borderWidth='1px' borderRadius='lg' overflow='hidden'>
          <Box bg="purple" color="white" w="100%" >
            <HStack spacing="24px" pt="24px">
              <Box w="100%" h="40px">
                <Text align="left">Patient Ipsum</Text>
              </Box>
              
              <Box w="60%" h="40px">
                <Text align="right">Compliance: 100%</Text>
              </Box>
            </HStack>
          </Box>
          <SurgeonMyPtSurveyDetail/>
        </Container>

         <Container minW="420px" bg="purple" color="#262626" borderWidth='1px' borderRadius='lg' overflow='hidden'>
          <Box bg="purple" color="white" w="100%" >
            <HStack spacing="24px" pt="24px">
              <Box w="100%" h="40px">
                <Text align="left">Patient Ipsum</Text>
              </Box>
              
              <Box w="60%" h="40px">
                <Text align="right">Compliance: 90%</Text>
              </Box>
            </HStack>
          </Box>
          <SurgeonMyPtSurveyDetail/>
        </Container>       
      </>
    );
  };
  