import React, { useEffect, useState } from "react";

import { PageLayout } from "../components/page-layout";
import { CodeSnippet } from "../components/code-snippet";
import { getStateByStateHash, getStateHello, getQuestionnaireByProHash } from "../services/message.service";


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



  //logic for PRO format
  /* IMORTANT: 
        Needs reworked -- very sloppy code
  */
  interface questionData {
    [key: string]: any;
  }

  useEffect(() => {
    const buildForm = (svalue:{[key: string]: any }|null,qvalue:{ [key: string]: any }|null) => {
      let rvalue = [];
  
  
      if( qvalue != null && svalue != null )
      {
        let questionnaire_data:questionData = qvalue["data"]["questionnaire"];
        
        for ( let [key,value] of Object.entries(questionnaire_data) )
        {
          if( value["element"] === "question" )
          {
            let mvalue ={ name:"",fields:[{}] }
            mvalue.name = key.toString()
            
            mvalue.fields = [{
              "name":value["data"]["link_id"],
              "text":value["data"]["text"],
              "type":"text"
            }]
            rvalue.push(mvalue)
          }
          else if( value["element"] === "group" )
          {
            let group_questionnaire_data:questionData =value["data"]["questions"]
            // destructuring as we do not need the key in this for loop
            for ( let [,group_val] of Object.entries(group_questionnaire_data) )
            {
              let mvalue ={ name:"",fields:[{}] }
              mvalue.name = key.toString()
              mvalue.fields = [{
                "name":"step_"+group_val["link_id"],
                "text":group_val["text"],
                "type":"text"
              }]
              rvalue.push(mvalue)
            }
          }
  
        } 
      }
      
  
      return rvalue;
    }


    let isMounted = true;

    if (!isMounted) {
      return;
    }
 
    //************
    //***TODO*****
    //************
    //fill dynamic survey with proper states


    const data=getMessageStateByHash("abc");
    data.then(svalue => { 
        let key:string = "pro_hash";
        let pro_hash:string ="";

        if( svalue != null ){
          pro_hash = svalue[key];
        }

        let questionnaire_payload = getMessageQuestionnaireByProHash(pro_hash);
        questionnaire_payload.then(qvalue=> {
          const form_values = buildForm(svalue,qvalue) ;

          //@ts-ignore
          setproFormQuestions(form_values);
        });
    });
    
    return () => {
      isMounted = false;
    };
  }, []); 


  interface FormElement { 
      name: string, 
      fields: { 
        name: string,
        text: string, 
        type: string
      }[] 
  }
  interface FormElements extends Array<FormElement>{}

  const [proFormQuestions, setproFormQuestions] = useState<FormElements>( 
    [{
        name: "init",
        fields: [{
          name:"",
          text:"",
          type:""
        }]
    }]
  );

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
            {/* @ts-ignore */}
            <FormCard steps={proFormQuestions}/>
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


// ************************************* //
// Dead/Old Code/Samples
// ************************************* //
/*
  var formStep = [
    {
      name: "step1",
      fields: [
        { name: "name", text:"name", type: "text" },
        { name: "email", text:"email", type: "email" }
      ]
    },
    {
      name: "step2",
      fields: [
        { name: "address", text:"address", type: "text" },
        { name: "city", text:"city", type: "text" },
        { name: "state", text:"state", type: "text" },
        { name: "zip", text:"zip", type: "text" }
      ]
    }
  ];
*/
//var state_var = {};
//var questionnaire_payload = {};
// const [formStep, setFormStep] = useState<number>(0);
// const nextFormStep = () => setFormStep((currentStep) => currentStep + 1);
// const prevFormStep = () => setFormStep((currentStep) => currentStep - 1);
// Sample expected format of form steps
//import { useNavigate } from 'react-router-dom';