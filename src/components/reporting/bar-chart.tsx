import { ResponsiveBar } from "@nivo/bar";
import { CartesianMarkerProps, DatumValue } from "@nivo/core";
import data from "./sample-data-pt";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import CSS from "csstype";
import { useState,useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAggregateByAgg,getPtReportBySub } from "../../services/message.service";
import { Center,Flex } from '@chakra-ui/react'

export const BarChart = () => {

  const auth = useAuth();


  const [apidata, setApidata] = useState(
    [{}]
  );

  let keys = ["y"];
  //let genData =  generateCountriesData(keys, { size: 12 })
  const commonProperties = {
    width: 750,
    height: 400,
    margin: { top: 60, right: 80, bottom: 60, left: 80 },
    data: apidata,
    indexBy: "x",
    keys,
    padding: 0.2,
    labelTextColor: "inherit:darker(1.4)",
    labelSkipWidth: 16,
    labelSkipHeight: 16,
    maxValue: 100
  };

  
  const parentStyle: CSS.Properties = {
    height: "100%",
    margin: "0 auto",
    textAlign: "center",
    background: "#eeeeee"
  };
  

  const [showmark, setShowmark] = useState(false);
  const [tscore, setTscore] = useState(false);
  const [spec, setSpec] = useState(false);
  
  const [tscoreValue, setTscoreValue]=useState(0);
  const [specValue, setSpecValue]=useState(0);


  const [marks, setMarkers] = useState<CartesianMarkerProps<DatumValue>[]>([

  ]);
  

  const getAggregate = async (agg:string) => {
    let auth_token = await auth.getAccessToken();

    const { data, error } = await getAggregateByAgg(agg,auth_token);

    if (data) {
    }

    if (error) {
    }

    return data;
  };

  const getPtreport = async (sub:string) => {
    let auth_token = await auth.getAccessToken();

    const { data, error } = await getPtReportBySub(sub,auth_token);

    if (data) {
    }

    if (error) {
    }

    return data;
  };


  useEffect(() => {
    let isMounted = true;

    if (!isMounted) {
      return;
    }


    const aggdata=getAggregate("t_score");
    aggdata.then(svalue => {
      if( svalue !== null && "value" in svalue ){
        setTscoreValue(svalue.value)
      }
      else{
        setTscoreValue(0)
      }
    });

    const specdata=getAggregate("spec");
    specdata.then(svalue => {
      if( svalue !== null && "value" in svalue ){
        setSpecValue(svalue.value)
      }
      else{
        setSpecValue(0)
      }
    });

    console.log(tscoreValue);
    console.log("SUB", auth.sub);
    const ptreportdata=getPtreport(auth.sub);
    const builder:any = [];
    ptreportdata.then( svalue => {
      if( svalue !== null && "surveys" in svalue ){
        const iterable:any = svalue;

        iterable.surveys.forEach( ( survey:any ) => {
            console.log( survey.date );
            
            builder.push(
              {
                x: survey.date,
                y: survey.score
              }
            )

          }
        );

        setApidata(builder);
        console.log("builder",builder);
        console.log("apidata",apidata);
        console.log("data:",data);

      }
      else{

      }
    });



    return () => {
      isMounted = false;
  };
  },[]);



  useEffect(() => {
    const markerManagement = () => {
      console.log(tscore);
      const buildmark=[]
  
      if( tscore || spec ){
        if( tscore ){
          buildmark.push({
            axis: "y",
            value: tscoreValue,
            lineStyle: { stroke: "rgba(255, 255, 0, .75)", strokeWidth: 4 },
            legend: "T-Score Base",
            textStyle: { fill: "rgba(0, 0, 0, .75)", fontWeight: "bold" },
            legendOrientation: "horizontal",
          });
        }
        if( spec ){
          buildmark.push({
            axis: "y",
            value: specValue,
            lineStyle: { stroke: "rgba(255, 0, 0, .35)", strokeWidth: 4 },
            legend: "Speciality Base",
            textStyle: { fill: "rgba(0, 0, 0, .75)", fontWeight: "bold" },
            legendOrientation: "horizontal",
          })
        }
  
        setMarkers(buildmark as CartesianMarkerProps<DatumValue>[])
        setShowmark(true);
      }
      else{
        setMarkers([])
        setShowmark(false);
      }
    };

    markerManagement();
    console.log(tscore);
  },[tscore,spec])

  return (
    <>
      {/* Centering needs fixed.  Both with center and div you end up with a 0x0 container for bar */}

      {/*<Center>*/}
      {/*<div style={parentStyle}>*/}
        <ResponsiveBar
          {...commonProperties}
          colors={{ scheme: "category10" }}
          markers={ showmark ? marks : [] }
          
        />
        {/*</div>*/}
        {/*</Center>*/}
      <CheckboxGroup colorScheme="green">
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          <Checkbox
            onChange={() => {
              setTscore( prevState=>!prevState );
            }}
            value="show_t"
          >
            Show T-Score Baseline
          </Checkbox>
          <Checkbox
            onChange={() => {
              setSpec( prevState=>!prevState );
            }}
            value="show_spec"
          >
            Show Speciality Baseline
          </Checkbox>
        </Stack>
      </CheckboxGroup>
    </>
  );
};

/*
      [
        {
          axis: 'y',
          value: 65,
          lineStyle: { stroke: 'rgba(255, 255, 0, .75)', strokeWidth: 4 },
          legend: 'T-Score Base',
          textStyle: { fill: 'rgba(0, 0, 0, .75)', fontWeight: 'bold'  },
          legendOrientation: 'horizontal',
        },
        {
          axis: 'y',
          value: 80,
          lineStyle: { stroke: 'rgba(255, 0, 0, .35)', strokeWidth: 4 },
          legend: 'Speciality Base',
          textStyle: { fill: 'rgba(0, 0, 0, .75)', fontWeight: 'bold'  },
          legendOrientation: 'horizontal',
        },
      ]
      */
