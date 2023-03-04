import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Stack,
    Container,
    Flex,
  } from "@chakra-ui/react";

  import React, { useEffect,useState } from "react";
import {SurgeryInfo} from "./surgery-info"
import {SurveyGrouping} from "./survey-grouping"
import {SurveyOpen} from "./survey-open"
import {SurveyClosed} from "./survey-closed"
import { useAuth } from "../../hooks/useAuth";
import { getSurvey } from "../../services/message.service";


interface Survey {
  due: string;
  missed: string;
  name: string;
  description: string;
  assigned:string;
  completed:string;
  sid:string;
}

const survey_blank = {
  due: "",
  missed: "",
  name: "",
  description: "",
  assigned:"",
  completed:"",
  sid:""
}

export interface Props {
  hospital: string;
  surgeon: string;
  surgdate: string;
}



  export const PtNav: React.FC<Props> = (props)  => {
    const auth = useAuth();

    const [missed_survey, setMissed] = useState<Survey[]>( [ survey_blank ] );
    const [completed_survey, setCompleted] = useState<Survey[]>( [survey_blank] );
    const [open_survey, setOpen] = useState<Survey[]>( [survey_blank] );

    const getSurveyData = async (sub:string) => {
      let auth_token = await auth.getAccessToken();
      console.log(auth_token)
      const { data, error } = await getSurvey(sub,auth_token); 

      console.log(data);


      if (data) {
      }

      if (error) {
      }

      return data;
  };

    useEffect(() => {
      console.log("useEffect() pt-nav");
      let isMounted = true;

      if (!isMounted) {
      return;
      }


      const data=getSurveyData(auth.sub);
      console.log(data)
      data.then(svalue=> { 
        if( svalue !== null )
        {
          if( "open_surveys" in svalue ){
            setOpen(svalue.open_surveys) 
          }
          if( "completed_survey" in svalue ){
            setOpen(svalue.completd_surveys) 
          }
        }      
      });

 
      return () => {
          isMounted = false;
      };
    }, []); 


    return (
      <Container maxW={"5xl"}>
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="top"
            alignItems="center"
            display="flex"
          >
            <Stack flexDir="column" mb="2" alignItems="center">
              <SurgeryInfo  hospital={props.hospital} surgeon={props.surgeon} surgdate={props.surgdate}/>
              <Tabs isFitted variant="enclosed-colored">
                <TabList mb="1em">
                  <Tab _selected={{ color: "white", bg: "blue.500" }}>
                    Pending Surveys
                  </Tab>
                  <Tab _selected={{ color: "white", bg: "blue.500" }}>
                    Completed Surveys
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <>
                      {
                        open_survey.map( (item) => (
                            <SurveyOpen description={item.description}/>
                          )
                        )
                      }
                    </>
                    {/*
                    <SurveyGrouping/>
                    <SurveyOpen/>
                    <SurveyOpen/>
                  */}
                  </TabPanel>
                  <TabPanel>
                    <SurveyGrouping/>
                    <SurveyClosed/>
                    <SurveyClosed/>
                    <SurveyClosed/>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </Flex>
        </Stack>
      </Container>
    );
  };
  