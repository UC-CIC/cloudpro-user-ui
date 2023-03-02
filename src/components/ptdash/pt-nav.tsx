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
  
import {SurgeryInfo} from "./surgery-info"
import {SurveyGrouping} from "./survey-grouping"
import {SurveyOpen} from "./survey-open"
import {SurveyClosed} from "./survey-closed"

  export const PtNav = () => {
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
              <SurgeryInfo/>
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
                    <SurveyGrouping/>
                    <SurveyOpen/>
                    <SurveyOpen/>
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
  