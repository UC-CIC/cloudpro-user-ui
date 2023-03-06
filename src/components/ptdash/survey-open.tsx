import {
    HStack,
    Box,
    Text,
    Container,
    Button
  } from "@chakra-ui/react";
  import { getState } from "../../services/message.service";
  import { initState } from "../../services/message.service";

  import { useAuth } from "../../hooks/useAuth";


export interface Props {
    description: string;
    sid: string;
    propack: string;
    duedate:string;
}


export const SurveyOpen: React.FC<Props> = (props) => {
    const auth = useAuth();


    const executeGetState = async (state_hash:string) => {
      let auth_token = await auth.getAccessToken();
      console.log(auth_token)
      const { data, error } = await getState(state_hash,auth_token);

      if (data) {
      }

      if (error) {
      }

      return data;
  };
  const executeInitState = async (state_hash:string,propack:string) => {
    let auth_token = await auth.getAccessToken();
    console.log(auth_token)
    const { data, error } = await initState(state_hash,propack,auth_token);

    if (data) {
    }

    if (error) {
    }

    return data;
};

  const beginSurvey = async() => {
    let state_hash = props.sid + props.duedate;
    const data = executeGetState( state_hash );
    console.log("executeGetState",data)
    data.then(svalue => {
        console.log(svalue)
        console.log( svalue !== null )
        if( svalue !== null && !("state_hash" in svalue) ){ //init the state
          const result = executeInitState(state_hash,props.propack)
          result.then( ivalue => {
            console.log(ivalue)
          })
          
        }
      }
      
    )

    return
  };


    return (
      <>
        <Container minW="420px" >
          <Box w="100%" >
            <HStack spacing="24px" pt="24px">
              <Box w="40%" h="40px">
                <Button onClick={beginSurvey}>Begin Survey</Button>
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
  