import {
    HStack,
    Box,
    Text,
    Container,
    Button
  } from "@chakra-ui/react";
  
  import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
  export interface Props {
    description: string;
    missed: boolean;
}


  export const SurveyClosed: React.FC<Props> = (props) => {
    return (
      <>
        <Container minW="420px" >
          <Box w="100%" >
            <HStack spacing="24px" pt="24px">
            { props.missed ? <CloseIcon/> :
            <CheckIcon/> }
              <Box w="100%"  bg="tan">
                <Text align="left">{props.description}</Text>
              </Box>
            </HStack>
          </Box>
        </Container>
      </>
    );
  };
  