import {
    HStack,
    Box,
    Text,
    Container,
    Button
  } from "@chakra-ui/react";
  
  export interface Props {
    description: string;
}


  export const SurveyOpen: React.FC<Props> = (props) => {
    return (
      <>
        <Container minW="420px" >
          <Box w="100%" >
            <HStack spacing="24px" pt="24px">
              <Box w="40%" h="40px">
                <Button>Begin Survey</Button>
              </Box>
              <Box w="60%"  bg="tan">
                <Text align="left">{props.description}</Text>
              </Box>
            </HStack>
          </Box>
        </Container>
      </>
    );
  };
  