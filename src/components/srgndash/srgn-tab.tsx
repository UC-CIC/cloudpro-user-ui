import React from "react";
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

import { SurgeonPagePatients } from "../../pages/surgeon-page-patients";
import { SurgeonPageUpcoming } from "../../pages/surgeon-page-upcoming";

const tabs = [
  { text: "Upcoming PT. Surveys", Component: SurgeonPageUpcoming, panelProps: {} },
  { text: "My Patients", Component: SurgeonPagePatients, panelProps: {} },
];

export const SrgnTab: React.FC = () => {
  return (
    <Tabs isFitted variant="enclosed-colored">
      <TabList mb="1em">
        {tabs.map((tab) => (
          <Tab _selected={{ color: "white", bg: "blue.500" }} key={tab.text}>
            {tab.text}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab) => (
          <TabPanel>
            <tab.Component  {...tab.panelProps}/>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
