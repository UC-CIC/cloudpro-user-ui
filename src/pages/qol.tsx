import { useQuery } from 'react-query';
import { Stack } from '@chakra-ui/react';


import Loader from '../components/Loader/Loader';

import { Link } from '@chakra-ui/react';

import { useAuth } from '../hooks/useAuth';
import React from 'react';
import {
  getUserProfile,
  PatientProfile as PatientProfileType,
  simulateSurveyRoll
} from '../services/message.service';

const QOL: React.FC = () => {
  const auth = useAuth();

  const header_tags=[
    "Pre-Operation",
    "10 Day After Surgery",
    "1 Month After Surgery",
    "2 Month After Surgery",
    "3 Month After Surgery",
    "4 Month After Surgery",
    "5 Month After Surgery",
    "6 Month After Surgery",
    "7 Month After Surgery",
    "8 Month After Surgery",
    "9 Month After Surgery",
    "10 Month After Surgery",
    "11 Month After Surgery",
    "12 Month After Surgery",
  ]
  
  const buildList: any = ( sub:string, surgeryDate:string ) => {
    const descriptionTags=[];
    const dateObj = new Date(surgeryDate + " 00:00:00");


    // Pre Op
    dateObj.setDate(dateObj.getDate() - 10);
    descriptionTags.push(sub + "-" + dateObj.toISOString().slice(0, -13) + "00h00m00s-0");
    // 10 Day Post Op
    dateObj.setDate(dateObj.getDate() + 20);
    descriptionTags.push(sub + "-" + dateObj.toISOString().slice(0, -13) + "00h00m00s-1");

    // reset to surgery date
    dateObj.setDate(dateObj.getDate() - 10 );

    // Every month after
    for ( var i = 1; i <= 12; i++ ) {
      dateObj.setMonth(dateObj.getMonth() + 1)
      descriptionTags.push(sub + "-" + dateObj.toISOString().slice(0, -13) + "00h00m00s-" + (i+1).toString());
    }
    return ( descriptionTags );
  }
  const executeSchedSimulation:any = async( name:string ) => {
    alert("Survey roll submitted; please wait 3 minutes for it to take effect");
    const token = await auth.getAccessToken();
    const response = await simulateSurveyRoll(name,token);
  }


  const {
    data: profile,
    isLoading,
  } = useQuery('patientProfile', async () => {
    const token = await auth.getAccessToken();
    const { data, error } = await getUserProfile(auth.sub, token);
    if (!data && error) throw error;
    return data as PatientProfileType;
  });

  if (isLoading || !profile)
    return (
      <Stack mt="32" align="center">
        <Loader />
      </Stack>
    );


  return (
    <div>
      <h1><strong>Simulate Sweep</strong> ~~Surgery Date {profile.profile.surgeryDate}~~</h1>
      <hr></hr>
      <div>
        {   
          buildList( profile.sub, profile.profile.surgeryDate ).map( (name:any,index:any)=> {
            return <div key={index}><strong><Link color="teal.500" onClick={ () => executeSchedSimulation(name)}>{header_tags[index]} </Link></strong><br/>{name}<br/></div>
          })
        }
      </div>
    </div>
  );
};

export default QOL;
