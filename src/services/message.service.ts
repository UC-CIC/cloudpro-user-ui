import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../models/api-response";
import { callExternalApi } from "./external-api.service";

import {FormState} from "../models/form-state"

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL + "";
//const apiXToken = process.env.REACT_APP_API_X_TOKEN  + "";
//const apiToken = process.env.REACT_APP_API_TOKEN  + "";

// We can drop api x token and api token here after we iterate.


export const getUserProfile = async (sub:string): Promise<ApiResponse> => {
  console.log("In message.service. Calling user with: ", sub)
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/user/${sub}`,
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};


export const getStateHello = async (): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/`,
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getStateByStateHash = async (stateHash:string): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/${stateHash}`,
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getQuestionnaireByProHash = async (pro_hash:string): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/questionnaire/${pro_hash}`,
    method: "GET",
    headers: {
      "content-type": "application/json"
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};



export const updateFullState = async (state:FormState): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/update`,
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    data:state
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};



export const updateProfile = async (profile:any): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/user`,
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    data:profile
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};
