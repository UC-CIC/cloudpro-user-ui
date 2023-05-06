import { ResponsiveBar } from "@nivo/bar";
import { CartesianMarkerProps, DatumValue } from "@nivo/core";
import data from "./sample-data-pt";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
//import CSS from "csstype";
import { useState,useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAggregateByAgg,getPtReportBySub } from "../../services/message.service";

import { Select } from '@chakra-ui/react'

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

  /*
  const parentStyle: CSS.Properties = {
    height: "100%",
    margin: "0 auto",
    textAlign: "center",
    background: "#eeeeee"
  };
  */
  

  const [showmark, setShowmark] = useState(false);
  const [tscore, setTscore] = useState(false);
  const [spec, setSpec] = useState(false);
  
  const [tscoreValue, setTscoreValue]=useState(0);
  const [specValue, setSpecValue]=useState(0);
  const [options, setOptions]=useState<string[]>([]);

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

  
  const [chartdata, setChartdata] = useState({});
  
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



    /*
    console.log( survey.date );
    
    builder.push(
      {
        x: survey.date,
        y: survey.score
      }
    )
    */
           
    console.log(tscoreValue);
    console.log("SUB", auth.sub);
    const ptreportdata=getPtreport(auth.sub);
    const builder:any ={}
    const keys:any = [];

    ptreportdata.then( svalue => {
      console.log("PTREPORT DATA:", svalue);
      if( svalue !== null && "surveys" in svalue ){
        const iterable:any = svalue;
        console.log("ITERABLE:",iterable)

        iterable.surveys.forEach( ( survey:any ) => {
          Object.keys(survey).forEach( (key) => {
            keys.push(key)
            if (Array.isArray(survey[key])) {
              survey[key].forEach( (result:any) => {
                if( key in builder ){
                  builder[key].push( { "x": result.date, "y": result.score})
                }
                else{
                  builder[key]=[{ "x": result.date, "y": result.score}]
                }
                console.log( `Survey: ${key}, ${result.date}` );
              });
            }
          });
        });
        console.log("builder", builder)
        console.log("sval:", svalue.surveys[0][keys[0]])

        if( Object.keys(builder).length !== 0 ){
          setApidata(builder[keys[0]]);

          const uniqueKeys = keys.filter((value:string, index:number) => keys.indexOf(value) === index);
          setOptions(uniqueKeys);
          setChartdata(builder)
          console.log("UK: ", uniqueKeys)
          console.log("OPTIONS:", options)
        }
        else{
          setApidata([]);
        }

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


  const handleOptionChange = (event:any) => {
    console.log("TARGET:", event.target.value);
    console.log("BUILDER: ", chartdata)
    const chart_key:string = event.target.value
    const updater:{[key:string]:[data:any]} = chartdata
    console.log("UPDATE_DATA:", updater);
    console.log("KEYED:", updater[chart_key])
    if( chart_key in updater) {
      setApidata(updater[chart_key]);
    }
    else{
      setApidata([]);
    }

  }

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
        <Select onChange={handleOptionChange}>
          {
            options.map( (option:any) => (
                <option key={option} value={option}>
                  {option}
                </option>
            ))
          }
        
        </Select>
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
