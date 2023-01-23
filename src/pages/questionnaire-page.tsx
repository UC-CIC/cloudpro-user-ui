import React, { useEffect, useState } from "react";

import { PageLayout } from "../components/page-layout";
import { CodeSnippet } from "../components/code-snippet";
import { getStateByStateHash, getStateHello, getQuestionnaireByProHash } from "../services/message.service";
//import { useNavigate } from 'react-router-dom';

import {FormCard} from "../components/form-card";

export const Questionnaire: React.FC = () => {
  const [message, setMessage] = useState<string>("");


  const getMessageStateHello = async () => {
    const { data, error } = await getStateHello();

    if (data) {
      setMessage(JSON.stringify(data, null, 2));
    }

    if (error) {
      setMessage(JSON.stringify(error, null, 2));
    }
  };

  const getMessageStateByHash = async (stateHash:string) => {
    const { data, error } = await getStateByStateHash(stateHash);

    if (data) {
      setMessage(JSON.stringify(data, null, 2));
    }

    if (error) {
      setMessage(JSON.stringify(error, null, 2));
    }

    return data;
  };

  const getMessageQuestionnaireByProHash = async (pro_hash:string) => {
    const { data, error } = await getQuestionnaireByProHash(pro_hash);

    if (data) {
      setMessage(JSON.stringify(data, null, 2));
    }

    if (error) {
      setMessage(JSON.stringify(error, null, 2));
    }
    return data;
  };

  var state_var = {};
  var questionnaire_payload = {};

  useEffect(() => {
    let isMounted = true;

    if (!isMounted) {
      return;
    }
 
    //************
    //***TODO*****
    //************
    //set q payload & state payload
    //iterate through q payload and build dynamic survey
    //fill dynamic survey with proper states
    const data=getMessageStateByHash("abc");
    data.then(value => { 
        let key:string = "pro_hash"
        let pro_hash = value?.key ?? "";
        console.log(pro_hash)
        let questionnaire_payload = getMessageQuestionnaireByProHash(pro_hash);
        questionnaire_payload.then(qvalue=> {
          console.log(qvalue)
        });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const [formStep, setFormStep] = useState<number>(0);
  const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
  const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);


  const steps = [
    {
      name: "step1",
      fields: [
        { name: "name", type: "text" },
        { name: "email", type: "email" }
      ]
    },
    {
      name: "step2",
      fields: [
        { name: "address", type: "text" },
        { name: "city", type: "text" },
        { name: "state", type: "text" },
        { name: "zip", type: "text" }
      ]
    }
  ]
  
  return (
    <PageLayout>
      <div className="content-layout">
        <a href="/">Go To Home</a>
        
        <h1 id="page-title" className="content__title">
          Questionnaire Page
        </h1>
        
        <div className="content__body">
          <span>
                  This page retrieves a <strong>message</strong> from the Universal PRO Connector
                  microservice API.
          </span>
          <p></p>
          <h3 className="content__title">Form</h3>
          <div>
            <FormCard steps={steps}/>
          </div>
          <p></p>
          <h3 className="content__title">API Call Testing</h3>
          <div>
            <button onClick={getMessageStateHello}>State: Hello World</button>
            <button onClick={() => getMessageStateByHash("abc")}>State: Get State</button>
          </div>
          <CodeSnippet title="API Message" code={message} />      
        </div>
      </div>
    </PageLayout>
  )
};