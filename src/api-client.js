import axios from 'axios';

const apiBaseUrl = VUE_APP_API_URL; // eslint-disable-line no-undef
const client = axios.create({
  baseURL: apiBaseUrl + '/api',
  responseType: 'json',
});

export default client;
