import React, { useState,useEffect } from "react";

import {
    HStack,
    Box,
    Heading,
    Text,
    Divider,
    Container,
    Progress,
    Spacer
  } from "@chakra-ui/react";
  
  export interface Props {
    hospital: string;
    surgeon: string;
    surgdate: string;
  }
  

  export const SurgeryInfo: React.FC<Props> = (props)  => {
    const [monthsleft, setMonthsLeft] = useState(0);


    useEffect(() => {
      function diff_months(dt2:Date, dt1:Date) 
      {
     
       var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60 * 24 * 7 * 4);
       return Math.abs(Math.round(diff));
       
      }

      let surgdate = new Date(props.surgdate.replace('-','/') );
      console.log("surgdate: ",surgdate)
      let endDate = new Date(surgdate.setMonth(surgdate.getMonth()+11)); 
      console.log("enddate: ",endDate)
      let today = new Date();
      setMonthsLeft( diff_months(today,endDate) )

    },[props.surgdate]);

    return (
      <>
        <Container minW="400px" maxW="400px" bg="grey" color="#262626" borderWidth='1px' borderRadius='lg' overflow='hidden'>
          <Box bg="grey" color="white" w="100%" >
            <Heading pt="10px" pb="20px">
              <Text>Your Surgery</Text>
            </Heading>
            <Divider />
            <HStack spacing="24px" pt="24px">
              <Box w="40%" h="40px">
                <Text align="left">Operation Date:</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="left">{props.surgdate}</Text>
              </Box>
            </HStack>
            <HStack spacing="24px">
              <Box w="40%" h="40px">
                <Text align="left">Hospital:</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="left">{props.hospital}</Text>
              </Box>
            </HStack>
            <HStack spacing="24px" >
              <Box w="40%" h="40px">
                <Text align="left">Surgeon:</Text>
              </Box>
              <Box w="60%" h="40px">
                <Text align="left">{props.surgeon}</Text>
              </Box>
            </HStack>
            <Divider/>
            <Spacer pb="24px"/>
            <Progress value={( Math.max(0,12-monthsleft) /12)*100} />
            <Text>{monthsleft} Months of Observation Remain</Text>
            <Spacer pt="24px"/>
          </Box>
        </Container>
      </>
    );
  };
  