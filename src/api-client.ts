import axios, { AxiosRequestConfig } from 'axios';

// @ts-ignore
export const apiBaseUrl = VUE_APP_API_URL;

export const createApiClient = (options = {}) => {
  const client = axios.create({
    baseURL: apiBaseUrl,
    responseType: 'json',
    ...options,
  });

  // @ts-ignore
  if (ENV === 'development') {
    client.interceptors.request.use((request: AxiosRequestConfig) => {
      console.info(`Requesting ${request.baseURL}${request.url}`);
      return request;
    });
  }

  return client;
}

export const statefulApiClient = createApiClient({
  withCredentials: true,
});

export default createApiClient({
  baseURL: `${apiBaseUrl}/api`,
});
