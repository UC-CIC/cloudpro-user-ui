import { useQuery } from 'react-query';

import { ResponsiveBar } from "@nivo/bar";
import { CartesianMarkerProps, DatumValue } from "@nivo/core";
import data from "./sample-data-pt";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
//import CSS from "csstype";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAggregateByAgg,getPtReportBySub } from "../../services/message.service";
import Loader from '../../components/Loader/Loader';
import { Select } from '@chakra-ui/react'

export const BarChart = () => {

  const auth = useAuth();

  const [optionIndex, setOptionIndex] = useState(0);


  //updates to pull via React Query
  const { data: tAgg, isLoading:isTAggLoading } = useQuery('tAgg', async () => {
    const token = await auth.getAccessToken();
    const { data, error } = await getAggregateByAgg("t_score",token);
    if (!data && error) throw error;
    return data;
  });
  const { data: specAgg, isLoading:isSpecLoading } = useQuery('specAgg', async () => {
    const token = await auth.getAccessToken();
    const { data, error } = await getAggregateByAgg("spec",token);
    if (!data && error) throw error;
    return data;
  });
  const { data: reportData, isLoading:isReportDataLoading } = useQuery('reportData', async () => {
    const token = await auth.getAccessToken();
    const { data, error } = await getPtReportBySub(auth.sub,token);
    if (!data && error) throw error;
    return data;
  });

  if ( isTAggLoading || isSpecLoading || isReportDataLoading )
  return (
    <Stack mt="32" align="center">
      <Loader />
    </Stack>
  );


  const options:string[] = [];


  const buildReportData:any = () => {
    const builder:any ={}
    
    if( reportData !== undefined && reportData !== null && "surveys" in reportData ){
      const iterable:any = reportData;

      iterable.surveys.forEach( ( survey:any ) => {
        Object.keys(survey).forEach( (key) => {
          options.push(key)
          if (Array.isArray(survey[key])) {
            survey[key].forEach( (result:any) => {
              if( key in builder ){
                builder[key].push( { "x": result.date, "y": result.score})
              }
              else{
                builder[key]=[{ "x": result.date, "y": result.score}]
              }
            });
          }
        });
      });
    }

    if ( options[optionIndex] in builder ) {
      return builder[options[optionIndex]]
    }
    else
      return []
}


  const keys = ["y"];
  const commonProperties = {
    width: 750,
    height: 400,
    margin: { top: 60, right: 80, bottom: 60, left: 80 },
    data: buildReportData(),
    indexBy: "x",
    keys,
    padding: 0.2,
    labelTextColor: "inherit:darker(1.4)",
    labelSkipWidth: 16,
    labelSkipHeight: 16,
    maxValue: 100
  };

  const handleOptionChange = (event:any) => {
    setOptionIndex(event.target.value);
  }


  return (
    <>
        <ResponsiveBar
          {...commonProperties}
          colors={{ scheme: "category10" }}
          markers={ [] }
        />

      
          <Select onChange={handleOptionChange}>
          {
            options.map( (option:any,index) => (
                <option key={option} value={index}>
                  {option}
                </option>
            ))
          }
        
        </Select>
    </>
  );
};

