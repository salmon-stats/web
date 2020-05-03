import axios, { AxiosRequestConfig } from 'axios';

// @ts-ignore
export const apiBaseUrl = VUE_APP_API_URL;

export const createApiClient = (options: AxiosRequestConfig = {}) => {
  const conf: AxiosRequestConfig = {
    baseURL: apiBaseUrl,
    responseType: 'json',
    ...options,
  };

  const client = axios.create(conf);

  // @ts-ignore
  if (ENV === 'development') {
    client.interceptors.request.use((request: AxiosRequestConfig) => {
      console.info(`Requesting ${request.baseURL}${request.url}`);
      return request;
    });
  }

  return client;
};

export const createStatefulApiClient = (options: AxiosRequestConfig = {}) =>
  createApiClient({
    ...options,
    withCredentials: true,
  });

export const statefulApiClient = createStatefulApiClient();

export default createApiClient({
  baseURL: `${apiBaseUrl}/api`,
});
