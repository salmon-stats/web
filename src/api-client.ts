import axios from 'axios';

// @ts-ignore
export const apiBaseUrl = VUE_APP_API_URL;

export const createApiClient = (options = {}) => axios.create({
  baseURL: apiBaseUrl,
  responseType: 'json',
  ...options,
});

export const statefulApiClient = createApiClient({
  withCredentials: true,
});

export default createApiClient({
  baseURL: `${apiBaseUrl}/api`,
});
