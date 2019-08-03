import axios from 'axios';

// @ts-ignore
const apiBaseUrl = VUE_APP_API_URL;
const client = axios.create({
  baseURL: apiBaseUrl + '/api',
  responseType: 'json',
});

export default client;
