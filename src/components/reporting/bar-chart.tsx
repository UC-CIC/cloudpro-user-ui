import { useQuery } from 'react-query';

import { ResponsiveBar } from '@nivo/bar';
//import { CartesianMarkerProps, DatumValue } from "@nivo/core";
//import data from "./sample-data-pt";
import {
  Checkbox,
  Stack,
  Container,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
//import CSS from "csstype";
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  getAggregateByAgg,
  getPtReportBySub,
} from '../../services/message.service';
import Loader from '../../components/Loader/Loader';
import { Select,useColorMode } from '@chakra-ui/react';

export const BarChart = () => {
  const auth = useAuth();
  const { colorMode } = useColorMode();
  const [optionIndex, setOptionIndex] = useState(0);
  const [showTMarker, setShowTMarker] = useState(false);
  const [showSpecMarker, setShowSpecMarker] = useState(false);

  //updates to pull via React Query
  const { data: tAgg, isLoading: isTAggLoading } = useQuery(
    'tAgg',
    async () => {
      const token = await auth.getAccessToken();
      const { data, error } = await getAggregateByAgg('t_score', token);
      if (!data && error) throw error;
      return data;
    },
  );
  const { data: specAgg, isLoading: isSpecLoading } = useQuery(
    'specAgg',
    async () => {
      const token = await auth.getAccessToken();
      const { data, error } = await getAggregateByAgg('spec', token);
      if (!data && error) throw error;
      return data;
    },
  );
  const { data: reportData, isLoading: isReportDataLoading } = useQuery(
    'reportData',
    async () => {
      const token = await auth.getAccessToken();
      const { data, error } = await getPtReportBySub(auth.sub, token);
      if (!data && error) throw error;
      return data;
    },
  );

  if (isTAggLoading || isSpecLoading || isReportDataLoading)
    return (
      <Stack mt="32" align="center">
        <Loader />
      </Stack>
    );

  const options: string[] = [];

  const buildReportData: any = () => {
    const builder: any = {};

    if (
      reportData !== undefined &&
      reportData !== null &&
      'surveys' in reportData
    ) {
      const iterable: any = reportData;

      iterable.surveys.forEach((survey: any) => {
        Object.keys(survey).forEach((key) => {
          options.push(key);
          if (Array.isArray(survey[key])) {
            survey[key].forEach((result: any) => {
              if (key in builder) {
                builder[key].push({ x: result.date, y: result.score });
              } else {
                builder[key] = [{ x: result.date, y: result.score }];
              }
            });
          }
        });
      });
    }

    if (options[optionIndex] in builder) {
      return builder[options[optionIndex]];
    } else return [];
  };

  const keys = ['y'];
  const commonProperties = {
    height: 400,
    margin: { top: 60, right: 80, bottom: 60, left: 80 },
    data: buildReportData(),
    indexBy: 'x',
    keys,
    padding: 0.2,
    enableLabel: false,
    labelTextColor: 'inherit:darker(1.4)',
    labelSkipWidth: 16,
    labelSkipHeight: 16,
    maxValue: 100,
  };

  const handleOptionChange = (event: any) => {
    setOptionIndex(event.target.value);
  };

  const markerBase: any = {
    tScore: {
      axis: 'y',
      value: tAgg?.value | 0,
      lineStyle: { stroke: 'rgba(255, 255, 0, .75)', strokeWidth: 4 },
      legend: 'T-Score',
      textStyle: { fill: 'rgba(0, 0, 0, .75)', fontWeight: 'bold' },
      legendOrientation: 'horizontal',
    },
    specScore: {
      axis: 'y',
      value: specAgg?.value | 0,
      lineStyle: { stroke: 'rgba(255, 0, 0, .35)', strokeWidth: 4 },
      legend: 'S-Score',
      textStyle: { fill: 'rgba(0, 0, 0, .75)', fontWeight: 'bold' },
      legendOrientation: 'horizontal',
    },
  };

  const markerActive: any = () => {
    if (showSpecMarker && !showTMarker) {
      return [markerBase['specScore']];
    } else if (!showSpecMarker && showTMarker) {
      return [markerBase['tScore']];
    } else if (showSpecMarker && showTMarker) {
      return [markerBase['tScore'], markerBase['specScore']];
    }
  };

  return (
    <Container maxW="5xl">
      {commonProperties.data.length > 0 ? (
        <ResponsiveBar
          {...commonProperties}
          axisLeft={null}
          colors={{ scheme: 'category10' }}
          markers={showSpecMarker || showTMarker ? markerActive() : []}
        />
      ) : (
        <Alert
          status="info"
          variant="subtle"
          alignItems="left"
          justifyContent="left"
          textAlign="left"
          mb={4}
          mt={4}
        >
          <AlertIcon />
          There is no survey data available.
        </Alert>
      )}

      {options.length > 0 ? (
        <>
          <Select background={colorMode === "light" ? "black" : "white"} onChange={handleOptionChange}>
            {options.map((option: any, index) => (
              <option style={{ backgroundColor: 'white'}} key={option} value={index}>
                {option}
              </option>
            ))}
          </Select>
          {commonProperties.data.length > 0 ? (
            <Center>
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
              <Checkbox
                  isChecked={showSpecMarker}
                  onChange={() => {
                    setShowSpecMarker((prevState) => !prevState);
                  }}
                  value="specScore"
                  color={colorMode === "light" ? "black" : "white"}
                >
                  How you compare to other patients after Lorem Surgery (S-Score)
                </Checkbox>
                <Checkbox
                  isChecked={showTMarker}
                  onChange={() => {
                    setShowTMarker((prevState) => !prevState);
                  }}
                  value="tScore"
                  color={colorMode === "light" ? "black" : "white"}
                >
                  How you compare to everyone in the nation (T-Score)
                </Checkbox>
              </Stack>
            </Center>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </Container>
  );
};
