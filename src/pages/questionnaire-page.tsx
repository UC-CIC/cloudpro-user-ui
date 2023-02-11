import React, { useEffect, useState } from "react";

import { PageLayout } from "../components/page-layout";
import { CodeSnippet } from "../components/code-snippet";
import { getStateByStateHash, getStateHello, getQuestionnaireByProHash, updateFullState } from "../services/message.service";


import {FormCard} from "../components/form-card";

import {FormState} from "../models/form-state"

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
      //setproFormState(data as FormState);
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

  const putUpdateFullState = async (state:FormState) => {
    const { data, error } = await updateFullState(state);

    if (data) {
      setMessage(JSON.stringify(data, null, 2));
    }

    if (error) {
      setMessage(JSON.stringify(error, null, 2));
    }
    return data;
  };


  interface questionData {
    [key: string]: any;
  }

  interface FormElement { 
    name: string, 
    fields: { 
      name: string,
      text: string, 
      type: string,
      value: any,
      state?: any
    }[] 
    }
  interface FormElements extends Array<FormElement>{}

  const [proFormQuestions, setproFormQuestions] = useState<FormElements>( 
    [{
        name: "init",
        fields: [{
          name:"",
          text:"",
          type:"",
          value:null
        }]
    }]
  );


  interface FormData {
    [key: string]: {
      [link_id: string]: string | number;
    }
  }

  const [proFormState, setproFormState] = useState<FormState>( 
    {
      state_status: "",
      state_hash: "",
      pro_pack: "",
      states: {
        "":{
          entry_response:"",
          nxt:"",
          entry_state:"",
          prev:""
        }
      }
    }
  );
  
  useEffect(() => {
    const buildForm = (svalue:{[key: string]: any }|null,qvalue:{ [key: string]: any }|null) => {
      console.log("BUILD_FORM:",svalue);
      let rvalue:FormElements = [];
  
      if( qvalue != null && svalue != null )
      {
        let questionnaire_data:questionData = qvalue["data"]["questionnaire"];
        
        for ( let [key,value] of Object.entries(questionnaire_data) )
        {
          if( value["element"] === "question" )
          {
            let state_init;
            try{
              state_init = svalue.states[value["data"]["link_id"]]["entry_response"];
            }
            catch{
              state_init= null;
            }
            //let mvalue ={ name:"",fields:[{}] }
            let mvalue = {} as FormElement;
            mvalue.name = key.toString()
            mvalue.fields = [{
              name:value["data"]["link_id"],
              text:value["data"]["text"],
              type:value["data"]["type"],
              value:value["data"]["value"] ,
              state:state_init
            }]
            rvalue.push(mvalue)
          }
          else if( value["element"] === "group" )
          { // we will need logic here to build out for useValues().
            let group_questionnaire_data:questionData =value["data"]["questions"]
            // destructuring as we do not need the key in this for loop
            for ( let [,group_val] of Object.entries(group_questionnaire_data) )
            {
              let state_init;
              try{
                state_init = svalue.states[group_val["link_id"]]["entry_response"];
              }
              catch{
                state_init= null;
              }

              let mvalue = {} as FormElement; 
              mvalue.name = key.toString()
              mvalue.fields = [{
                name:"step_"+group_val["link_id"],
                text:group_val["text"],
                type:group_val["type"],
                value:value["data"]["value"],
                state:state_init
              }]


              rvalue.push(mvalue)
            }
          }
  
        } 
      }
      
      return rvalue;
    }

    console.log("useEffect()");
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

        let key:string = "pro_pack";
        let pro_hash:string ="";

        if( svalue != null ){
          pro_hash = svalue[key];
          setproFormState(svalue as FormState);
        }

        let questionnaire_payload = getMessageQuestionnaireByProHash(pro_hash);
        questionnaire_payload.then(qvalue=> {
          const form_values = buildForm(svalue,qvalue) ;
          setproFormQuestions(form_values);
        });
    });
    
    return () => {
      isMounted = false;
    };
  }, []); 


  const saveState = (data: FormData) => {
    //alert(JSON.stringify(proFormState, null, 2));
    //alert(JSON.stringify(data, null, 2));
    let svalue = proFormState;
    let qvalue = proFormQuestions;

    //console.log("qvalueSaveState:",qvalue)
 
    

    for ( let [idx,form_entry] of Object.entries(data) )
    {
      for ( let [state_key,state_value] of Object.entries(form_entry) ){
        let index:number = Number(idx);
        //console.log(state_key);
        //console.log(state_value);
        svalue.states[state_key].entry_response = state_value
        svalue.states[state_key].entry_state = "updated"
        //console.log("idx",qvalue[index])
        //console.log("svalue",svalue);
   
        //WARNING:  Potential bug here assuming multiple fields
        qvalue[index].fields[0].state = state_value;
      }
    }
    //console.log("Q:",qvalue)
    setproFormQuestions(qvalue);
    setproFormState(  svalue as FormState);
    //alert(JSON.stringify(proFormState, null, 2));
    setMessage(JSON.stringify(proFormState, null, 2));
    putUpdateFullState(proFormState);
  };
 
  
  
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
            <FormCard saveState={saveState} steps={proFormQuestions} />
          </div>
          <p></p>
          <h3 className="content__title">API Call Testing</h3>
          <div>
            <button onClick={getMessageStateHello}>State: Hello World</button>
            {/* hard codes eventually need to go out as development iterates */}
            <button onClick={() => getMessageStateByHash("abc")}>State: Get State</button>
            <button onClick={() => getMessageQuestionnaireByProHash("2d7243474da051a4243697acdaba49dab0795f0ba7815caab4044e6740ac481a")}>PROPack: Get Questionnaire</button>
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