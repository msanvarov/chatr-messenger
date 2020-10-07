import axios, { AxiosBasicCredentials, AxiosRequestConfig } from 'axios';

export const callAPI = async <T>(
  method: AxiosRequestConfig['method'],
  url: string,
  params?: AxiosRequestConfig['params'],
  auth?: AxiosBasicCredentials,
  data?: T,
) => {
  const res = await axios({
    url,
    method,
    auth,
    params,
    data,
  });
  return res.data;
};
