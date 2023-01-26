import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../models/api-response";
import { callExternalApi } from "./external-api.service";

import {FormState} from "../models/form-state"

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL + "";
const apiXToken = process.env.REACT_APP_API_X_TOKEN  + "";
const apiToken = process.env.REACT_APP_API_TOKEN  + "";

export const getStateHello = async (): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/?token=${apiToken}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-token": apiXToken
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
    url: `${apiServerUrl}/state/${stateHash}?token=${apiToken}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-token": apiXToken
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
    url: `${apiServerUrl}/questionnaire/${pro_hash}?token=${apiToken}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-token": apiXToken
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
    url: `${apiServerUrl}/state/update?token=${apiToken}`,
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-token": apiXToken
    },
    data:state
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};



