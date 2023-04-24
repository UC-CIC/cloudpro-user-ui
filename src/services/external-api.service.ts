import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { mapObjectKeys, snakeToCamelCase } from './helpers';
import { ApiResponse } from '../models/api-response';
import { AppError } from '../models/app-error';
import { Message } from '../models/message';

export const callExternalApi = async <T = Message>(options: {
  config: AxiosRequestConfig;
  transform?: boolean;
}): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await axios(options.config);
    const { data } = response;

    return {
      data: options.transform ? mapObjectKeys(data, snakeToCamelCase) : data,
      error: null,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const { response } = axiosError;

      let message = 'http request failed';
      if (response && response.statusText) {
        message = response.statusText;
      } else if (axiosError.message) {
        message = axiosError.message;
      } else if (
        response &&
        response.data &&
        (response.data as AppError).message
      ) {
        message = (response.data as AppError).message;
      }

      return {
        data: null,
        error: {
          message,
        },
      };
    }

    return {
      data: null,
      error: {
        message: (error as Error).message,
      },
    };
  }
};
