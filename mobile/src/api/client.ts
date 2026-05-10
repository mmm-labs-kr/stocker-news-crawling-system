import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { config } from '../constants/config';

export const TOKEN_KEY = 'auth_token';

const client = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
});

client.interceptors.request.use(async (req) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default client;
