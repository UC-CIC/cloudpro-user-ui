import React, { useEffect, useState } from "react";

import { getStateByStateHash, getStateHello, getQuestionnaireByProHash, updateFullState } from "../services/message.service";
import { QuestionnaireForm } from '../components/QuestionnaireForm/QuestionnaireForm';


import { PageLayout } from "../components/page-layout";
import PrivateRoute from "../components/PrivateRoute";

import {FormCard} from "../components/form-card";

import {FormState} from "../models/form-state"
import { useAuth } from "../hooks/useAuth";

import {useLocation } from "react-router-dom"

import {
  Stack,
  Container,
  Flex,
} from "@chakra-ui/react";


export const Survey: React.FC = () => {
  const location = useLocation();

  const auth = useAuth();
  const [message, setMessage] = useState<string>("");


  const getMessageStateHello = async () => {
    let auth_token = await auth.getAccessToken();

    const { data, error } = await getStateHello(auth_token);

    if (data) {
      setMessage(JSON.stringify(data, null, 2));
    }

    if (error) {
      setMessage(JSON.stringify(error, null, 2));
    }
  };

  const getMessageStateByHash = async (stateHash:string) => {
    let auth_token = await auth.getAccessToken();

    const { data, error } = await getStateByStateHash(stateHash,auth_token);

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
    let auth_token = await auth.getAccessToken();

    const { data, error } = await getQuestionnaireByProHash(pro_hash,auth_token);

    if (data) {
      setMessage(JSON.stringify(data, null, 2));
    }

    if (error) {
      setMessage(JSON.stringify(error, null, 2));
    }
    return data;
  };

  const putUpdateFullState = async (state:FormState) => {
    let auth_token = await auth.getAccessToken();

    const { data, error } = await updateFullState(state,auth_token);

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

    
    const data=getMessageStateByHash(location.state.shash);
    
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
      <PrivateRoute>
        <Container maxW={"5xl"}>
          <Stack
            textAlign={"center"}
            align={"center"}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}
          >
            <Flex
              flexDirection="column"
              width="100wh"
              height="100vh"
              justifyContent="top"
              alignItems="center"
              display="flex"
            >
              <div className="content-layout"> 
                <h1 id="page-title" className="content__title">
                  Questionnaire Page
                </h1>
  
                <div className="content__body">
                  <h3 className="content__title">Form</h3>
                  <div>
                    <QuestionnaireForm saveState={saveState} steps={proFormQuestions} />
                  </div>
                </div>
              </div>
            </Flex>
          </Stack>
        </Container>
      </PrivateRoute>
    </PageLayout>
  );
  
};

