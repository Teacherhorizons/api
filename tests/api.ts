import axios, { AxiosInstance } from 'axios';
import cookie from 'cookie';

import config from './config';

export var api: AxiosInstance;

export const signIn = async (userName?: string) => {
  // sign in as userName and set the api global variable
  const axiosData = 'email=' + userName + '&password=password&keepMeSignedIn=0';
  const axiosConfig = {
    baseURL: config.baseURL,
    auth: config.auth,
    headers: {
      Cookie: '',
    },
  };
  if (userName) {
    const signInResponse = await axios.post('auth/sign-in', axiosData, axiosConfig);
    const JSESSIONID = cookie.parse(signInResponse.headers['set-cookie'][0]).JSESSIONID;
    axiosConfig.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
  }
  api = axios.create(axiosConfig);
  // console.log('sign in successful');
};

export const setApi = signIn;

export const signOut = async () => {
  await api.post('user/sign-out');
  // console.log('sign out successful');
};
