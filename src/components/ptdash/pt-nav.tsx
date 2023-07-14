import React, { useMemo } from 'react';
import { useQuery } from 'react-query';

import {
  Box,
  Container,
  Divider,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Text,
} from '@chakra-ui/react';

import { SurveyClosed } from './survey-closed';
import { SurveyGrouping } from './survey-grouping';
import { SurgeryInfo } from './surgery-info';
import { SurveyOpen } from './survey-open';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/Loader/Loader';
import { PageLayout } from '../../components/page-layout';
import { getSurvey } from '../../services/message.service';

interface Survey {
  due: string;
  missed: boolean;
  name: string;
  description: string;
  assigned: string;
  completed: boolean;
  propack: string;
  sid: string;
}

interface SurveySet {
  groupName: string;
  surveys: Survey[];
}

export interface Props {
  hospital: string;
  surgeon: string;
  surgdate: string;
}

/**
 * Map survey data retrieved from the API to the format expected by the UI.
 * Filters out groups with no surveys.
 *
 * @param dataSurveys Survey groups retrieved by the API
 */
const mapDataSurveys = (dataSurveys: Record<string, Survey[]>[]) => {
  return dataSurveys.reduce(
    (acc: SurveySet[][], groupSet: Record<string, Survey[]>) => {
      const sets: SurveySet[] = [];
      Object.entries(groupSet).forEach(([groupName, surveyList]) => {
        if (surveyList.length) sets.push({ groupName, surveys: surveyList });
      });
      if (sets.length) acc.push(sets);
      return acc;
    },
    [],
  );
};

export const PtNav: React.FC<Props> = (props) => {
  const auth = useAuth();

  const { data, isError, isLoading } = useQuery(
    'patientSurveys',
    async () => {
      const token = await auth.getAccessToken();
      const { data, error } = await getSurvey(auth.sub, token);
      if (!data && error) throw error;
      return data;
    },
    { refetchOnMount: 'always' },
  );

  // Retrieve and format the list of open surveys
  const openSurveys: SurveySet[][] = useMemo(
    () => mapDataSurveys(data?.openSurveys || []),
    [data?.openSurveys],
  );

  // Retrieve and format the list of closed surveys
  const completedSurveys: SurveySet[][] = useMemo(
    () => mapDataSurveys(data?.completedSurveys || []),
    [data?.completedSurveys],
  );

  return (
    <PageLayout>
      <Container maxW="3xl">
        <Stack
          direction="column"
          justifyContent="top"
          align="center"
          spacing="8"
          mb="2"
          textAlign="center"
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {/* Top-level surgery info card */}
              <SurgeryInfo
                hospital={props.hospital}
                surgeon={props.surgeon}
                surgeryDate={props.surgdate}
              />

              {/* Navigation tabs */}
              <Tabs isFitted variant="unstyled" width="100%">
                <Box pb="4">
                  <TabList borderBottom="1px" borderColor="gray.300">
                    <NavTab
                      isDisabled={!openSurveys.length}
                      text="Pending Surveys"
                    />
                    <NavTab
                      isDisabled={!completedSurveys.length}
                      text="Completed Surveys"
                    />
                  </TabList>
                  <TabIndicator height="2px" bg="teal" borderRadius="1px" />
                </Box>

                <TabPanels>
                  {/* Pending surveys */}
                  <SurveysPanel
                    renderSurvey={(item: Survey) => (
                      <SurveyOpen
                        key={item.sid}
                        description={item.description}
                        sid={item.sid}
                        propack={item.propack}
                        duedate={item.due}
                      />
                    )}
                    surveys={openSurveys}
                  />

                  {/* Completed surveys */}
                  <SurveysPanel
                    renderSurvey={(item: Survey) => (
                      <SurveyClosed
                        key={item.sid}
                        sid={item.sid}
                        duedate={item.due}
                        description={item.name}
                        missed={item.missed}
                      />
                    )}
                    surveys={completedSurveys}
                  />
                </TabPanels>
              </Tabs>
            </>
          )}
        </Stack>
      </Container>
    </PageLayout>
  );
};

const NavTab: React.FC<{ isDisabled?: boolean; text: string }> = ({
  isDisabled = false,
  text,
}) => (
  <Tab isDisabled={isDisabled} fontWeight="bold">
    {text}
  </Tab>
);

const SurveysPanel: React.FC<{
  renderSurvey: (survey: Survey) => React.ReactNode;
  surveys: SurveySet[][];
}> = ({ renderSurvey, surveys }) => {
  return (
    <TabPanel>
      {!surveys.length && <Text>Nothing yet to review.</Text>}

      {surveys.map((groupSet: SurveySet[]) =>
        groupSet.map(({ groupName, surveys }) => (
          <Container key={groupName}>
            {/* Group due date */}
            <SurveyGrouping
              dueDate={surveys[0].due.split('T')[0]}
              grouping={groupName}
            />

            {/* Surveys */}
            <Stack divider={<Divider />} pt="4">
              {surveys.map((item) => (
                <React.Fragment key={item.sid}>
                  {renderSurvey(item)}
                </React.Fragment>
              ))}
            </Stack>
          </Container>
        )),
      )}
    </TabPanel>
  );
};
