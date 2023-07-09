import { AxiosRequestConfig } from 'axios';

import { callExternalApi } from './external-api.service';
import { camelToSnakeCase, mapObjectKeys, snakeToCamelCase } from './helpers';
import { ApiResponse } from '../models/api-response';
import { Audit, FormState, Questionnaire } from '../models/form-state';
import { UserNotifications } from '../models/notifications';

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL + '';

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
  let { data, error } = await callExternalApi<FormState>({ config });
  if (data) data = transformState(data, camelToSnakeCase);
  return { data, error };
};

export const getSurvey = async (
  sub: string,
  authToken: String,
): Promise<ApiResponse> => {
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

export const closeSurvey = async (
  sub: string,
  authToken: String,
  sid: string,
  dueDate: string,
): Promise<ApiResponse<FormState>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/survey/${sub}`,
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    data: { sid: sid, due_date: dueDate },
  };

  let { data, error } = await callExternalApi<FormState>({ config });
  if (data) data = transformState(data, camelToSnakeCase);
  return { data, error };
};

export const getAudit = async (
  authToken: String,
  sid: String,
): Promise<ApiResponse<Audit>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/audit/${sid}`,
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };
  let { data, error } = await callExternalApi<Audit>({ config });
  if (data) {
    const { state, ...rest } = data;
    data = Object.assign(
      { state: transformState(data.state, snakeToCamelCase) },
      mapObjectKeys(rest, snakeToCamelCase),
    );
  }
  return { data, error };
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

  if (Object.keys(state).length === 0) {
    return Object.assign({ states: {} }, mapObjectKeys(rest, transform));
  }

  const transformedStates: typeof states = {};
  for (const [key, value] of Object.entries(states)) {
    transformedStates[key] = mapObjectKeys(value, transform);
  }

  return Object.assign(
    { states: transformedStates },
    mapObjectKeys(rest, transform),
  );
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

export const evaluateScore = async (
  linkId: string,
  scoreData: {
    proPack: string;
    proPackFormat: string;
    data: Record<string, any>;
  },
  authToken: string,
): Promise<ApiResponse<any>> => {
  const { proPack, proPackFormat } = scoreData;
  const formData = { ...scoreData.data };
  delete formData[linkId];

  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/scoring/evaluate/${linkId}`,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    data: {
      pro_pack: proPack,
      pro_pack_format: proPackFormat,
      data: formData,
    },
  };
  const { data, error } = await callExternalApi<Record<string, number>>({
    config,
    transform: true,
  });
  return { data: data?.result, error };
};

export const updateFullState = async (
  state: FormState,
  authToken: String,
): Promise<ApiResponse<FormState>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/state`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    data: transformState(state, camelToSnakeCase),
  };
  let { data, error } = await callExternalApi<FormState>({ config });
  if (data) data = transformState(data, snakeToCamelCase);
  return { data, error };
};
