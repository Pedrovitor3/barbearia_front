import axios from 'axios';
import { baseURL } from './baseService/baseUrl';

export const LoginService = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${baseURL}/login`, {
      username,
      password,
    });
    return response;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};
