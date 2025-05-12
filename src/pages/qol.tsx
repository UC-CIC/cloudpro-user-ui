import { useQuery } from 'react-query';
import { Stack } from '@chakra-ui/react';


import Loader from '../components/Loader/Loader';

import { Link, Input } from '@chakra-ui/react';

import { useAuth } from '../hooks/useAuth';
import React, { useState } from 'react';
import {
  getUserProfile,
  PatientProfile as PatientProfileType,
  simulateSurveyRoll,
  uploader,
  uploadFile
} from '../services/message.service';

const QOL: React.FC = () => {

  const [file, setFile] = useState<File>();
  const auth = useAuth();

  const header_tags = [
    "Before Surgery",
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

  const buildList: any = (sub: string, surgeryDate: string) => {
    const descriptionTags = [];
    const dateObj = new Date(surgeryDate);


    // Pre Op
    dateObj.setDate(dateObj.getDate() - 10);
    descriptionTags.push(sub + "-" + dateObj.toISOString().slice(0, -13) + "00h00m00s-0");
    // 10 Day Post Op
    dateObj.setDate(dateObj.getDate() + 20);
    descriptionTags.push(sub + "-" + dateObj.toISOString().slice(0, -13) + "00h00m00s-1");

    // reset to surgery date
    dateObj.setDate(dateObj.getDate() - 10);

    // Every month after
    for (var i = 1; i <= 12; i++) {
      dateObj.setMonth(dateObj.getMonth() + 1)
      descriptionTags.push(sub + "-" + dateObj.toISOString().slice(0, -13) + "00h00m00s-" + (i + 1).toString());
    }
    return (descriptionTags);
  }
  const executeSchedSimulation: any = async (name: string) => {
    alert("Survey roll submitted; please wait 3 minutes for it to take effect");
    const token = await auth.getAccessToken();
    const response = await simulateSurveyRoll(name, token);
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

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const getMyToken: any = async () => {
    const token = await auth.getAccessToken();
    return token
  }

  const handleUploadClick = () => {
    if (!file) {
      return;
    }
    getMyToken().then(function (token: any) {
      const authToken: any = token;
      uploader(authToken, file.name).then(function (response: any) {
        const preSignedUrlData: any = response;
        const formData = new FormData();
        console.log("PreSigned:", preSignedUrlData);
        // append the fields in presignedPostData in formData            
        Object.keys(preSignedUrlData.data.fields).forEach(key => {
          formData.append(key, preSignedUrlData.data.fields[key]);
          console.log("KEY:", key)
          //console.log("VAL:",preSignedUrlData.data.fields[key])
        });
        // append the file
        formData.append("file", file);
        console.log(file)
        console.log(formData.getAll("file"))

        uploadFile(preSignedUrlData.data.url, formData).then(function (response: any) {
          console.log(response);
        })

      });
    });

  };


  return (
    <div>
      <h1><strong>Simulate Sweep</strong> ~~Surgery Date {profile.profile.surgeryDate}~~</h1>
      <hr></hr>
      <div>
        {
          buildList(profile.sub, profile.profile.surgeryDate).map((name: any, index: any) => {
            return <div key={index}><strong><Link color="teal.500" onClick={() => executeSchedSimulation(name)}>{header_tags[index]} </Link></strong><br />{name}<br /></div>
          })
        }
      </div>
      <h1><strong>Simulate PROPack UPload</strong></h1>
      <hr></hr>
      <Input
        placeholder="Upload PROPack"
        size="md"
        type="file"
        onChange={(event) => handleFileChange(event)}
      />
      <div>{file && `${file.name} - ${file.type}`}</div>
      <button onClick={handleUploadClick}>Upload</button>
    </div>
  );
};

export default QOL;
