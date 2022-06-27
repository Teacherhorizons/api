import axios from 'axios';
import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';

import config from './config';

export var api;

export function setup(context = {}) {
  beforeAll(() => {
    jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
  });

  return context;
}

export const signIn = async (userName) => {
  // sign in as userName and set the api global variable
  const axiosData = 'email='+userName+'&password=password&keepMeSignedIn=0';
  const axiosConfig = {
    baseURL: config.baseURL,
    auth: config.auth,
    headers: {
      Cookie: '',
    }
  };
  const signInResponse = await axios.post('auth/sign-in', axiosData, axiosConfig);
  const JSESSIONID = cookie.parse(signInResponse.headers['set-cookie'][0]).JSESSIONID;
  axiosConfig.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
  api = axios.create(axiosConfig);
}

export const signOut = async () => {
  await api.post('user/sign-out');
}

