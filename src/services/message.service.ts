import { AxiosRequestConfig } from 'axios';

import { callExternalApi } from './external-api.service';
import { camelToSnakeCase, mapObjectKeys, snakeToCamelCase } from './helpers';
import { ApiResponse } from '../models/api-response';
import { FormState, Questionnaire } from '../models/form-state';
import { UserNotifications } from '../models/notifications';

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL + '';
//const apiXToken = process.env.REACT_APP_API_X_TOKEN  + "";
//const apiToken = process.env.REACT_APP_API_TOKEN  + "";

// We can drop api x token and api token here after we iterate.

export interface PatientProfile {
  challenge: {
    c1a: string;
    c1q: string;
    c2a: string;
    c2q: string;
    c3a: string;
    c3q: string;
  };
  email: string;
  profile: {
    birthDate: string;
    birthSex: string;
    firstName: string;
    hospital: string;
    lastName: string;
    phone: string;
    surgeon: string;
    surgeryDate: string;
  };
  state: 'INIT' | 'STAGED' | 'COMPLETE';
  sub: string;
  tfa: string;
}

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

  return callExternalApi({ config, transform: true });
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

  return callExternalApi({ config, transform: true });
};

export const getNotificationsBySub = async (
  sub: string,
  authToken: String,
): Promise<ApiResponse<UserNotifications>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/notifications/${sub}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };
  return callExternalApi<UserNotifications>({ config, transform: true });
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
  propack: string,
  stateHash: string,
  authToken: String,
): Promise<ApiResponse<FormState>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/init/${propack}/${stateHash}`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };
  return callExternalApi<FormState>({ config, transform: true });
};

export const getSurvey = async (
  sub: string,
  authToken: String,
): Promise<ApiResponse> => {
  console.log('In message.service. Calling user with: ', sub);
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/survey/${sub}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };

  const { data, error } = (await callExternalApi({
    config,
    transform: true,
  })) as ApiResponse;

  return {
    data,
    error,
  };
};

export const getUserProfile = async (
  sub: string,
  authToken: String,
): Promise<ApiResponse> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/user/${sub}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };

  return callExternalApi({ config, transform: true });
};

export const updateProfile = async (
  profile: any,
  authToken: String,
): Promise<ApiResponse<PatientProfile>> => {
  // Transform data keys
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/user`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    data: mapObjectKeys(profile, camelToSnakeCase),
  };
  return callExternalApi<PatientProfile>({ config, transform: true });
};

const transformState = (
  state: FormState,
  transform: (str: string) => string,
): FormState => {
  // Transform all props except state
  const { states, ...rest } = state;
  return Object.assign({ states }, mapObjectKeys(rest, transform));
};

export const getStateByStateHash = async (
  stateHash: string,
  authToken: String,
): Promise<ApiResponse<FormState>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/${stateHash}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };
  let { data, error } = await callExternalApi<FormState>({ config });
  if (data) data = transformState(data, snakeToCamelCase);
  return { data, error };
};

export const getQuestionnaireByProHash = async (
  proHash: string,
  authToken: String,
): Promise<ApiResponse<Questionnaire>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/questionnaire/${proHash}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };
  return callExternalApi<Questionnaire>({ config, transform: true });
};

export const updateFullState = async (
  state: FormState,
  authToken: String,
): Promise<ApiResponse<FormState>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state/update`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    data: transformState(state, camelToSnakeCase),
  };
  let { data, error } = await callExternalApi<FormState>({ config });
  if (data) data = transformState(data, camelToSnakeCase);
  return { data, error };
};
