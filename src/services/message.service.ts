import { AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../models/api-response';
import { callExternalApi } from './external-api.service';

import { FormState } from '../models/form-state';

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL + '';
//const apiXToken = process.env.REACT_APP_API_X_TOKEN  + "";
//const apiToken = process.env.REACT_APP_API_TOKEN  + "";

// We can drop api x token and api token here after we iterate.



export const getHospitalByHid = async (
  hid: string,
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/hospital/hid/${hid}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};
export const getHospitalList = async (
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/hospital/list`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};


export const getNotificationsBySub = async (
  sub: string,
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/notifications/${sub}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};


export const getPtReportBySub = async (
  sub: string,
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/ptreporting/${sub}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};


export const getAggregateByAgg = async (
  agg: string,
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/aggregates/${agg}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};



export const initState = async (
  state_hash: string,
  propack: string,
  auth_token: String,
): Promise<ApiResponse> => {
  console.log('In message.service. Calling user with: ', state_hash);
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/init/${state_hash}/${propack}`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getState = async (
  state_hash: string,
  auth_token: String,
): Promise<ApiResponse> => {
  console.log('In message.service. Calling user with: ', state_hash);
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/${state_hash}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getSurvey = async (
  sub: string,
  auth_token: String,
): Promise<ApiResponse> => {
  console.log('In message.service. Calling user with: ', sub);
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/survey/${sub}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getUserProfile = async (
  sub: string,
  auth_token: String,
): Promise<ApiResponse> => {
  console.log('In message.service. Calling user with: ', sub);
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/user/${sub}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const updateProfile = async (
  profile: any,
  auth_token: String,
): Promise<ApiResponse> => {
  console.log('MSG SVC AUTH TOKEN: ', auth_token);
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/user`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
    data: profile,
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getStateHello = async (
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getStateByStateHash = async (
  stateHash: string,
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/${stateHash}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getQuestionnaireByProHash = async (
  pro_hash: string,
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/questionnaire/${pro_hash}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const updateFullState = async (
  state: FormState,
  auth_token: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/update`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${auth_token}`,
    },
    data: state,
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse;

  return {
    data,
    error,
  };
};
