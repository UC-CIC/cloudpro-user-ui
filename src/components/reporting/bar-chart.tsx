import { ResponsiveBar } from "@nivo/bar";
import { CartesianMarkerProps, DatumValue } from "@nivo/core";
import data from "./sample-data-pt";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
//import CSS from "csstype";
import { useState } from "react";

export const BarChart = () => {
  let keys = ["y"];
  //let genData =  generateCountriesData(keys, { size: 12 })
  const commonProperties = {
    width: 750,
    height: 400,
    margin: { top: 60, right: 80, bottom: 60, left: 80 },
    data: data,
    indexBy: "x",
    keys,
    padding: 0.2,
    labelTextColor: "inherit:darker(1.4)",
    labelSkipWidth: 16,
    labelSkipHeight: 16,
  };

  /*
  const parentStyle: CSS.Properties = {
    textAlign: "center",
  };
  */

  const [showmark, setShowmark] = useState(false);
  const [tscore, setTscore] = useState(false);
  const [spec, setSpec] = useState(false);
  
  const [marks, setMarkers] = useState<CartesianMarkerProps<DatumValue>[]>([

  ]);
  

  const markerManagement = () => {
    const buildmark=[]

    if( tscore || spec ){
      if( tscore ){
        buildmark.push({
          axis: "y",
          value: 65,
          lineStyle: { stroke: "rgba(255, 255, 0, .75)", strokeWidth: 4 },
          legend: "T-Score Base",
          textStyle: { fill: "rgba(0, 0, 0, .75)", fontWeight: "bold" },
          legendOrientation: "horizontal",
        });
      }
      if( spec ){
        buildmark.push({
          axis: "y",
          value: 80,
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

  return (
    <>
      
        <ResponsiveBar
          {...commonProperties}
          colors={{ scheme: "category10" }}
          markers={ showmark ? marks : [] }
        />
      
      <CheckboxGroup colorScheme="green">
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          <Checkbox
            onChange={() => {
              setTscore( prevState=>!prevState );
              markerManagement();
            }}
            value="show_t"
          >
            Show T-Score Baseline
          </Checkbox>
          <Checkbox
            onChange={() => {
              setSpec( prevState=>!prevState );
              markerManagement();
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
