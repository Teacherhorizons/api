import { AxiosInstance } from 'axios';
// import axios, { AxiosInstance } from 'axios';
// import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';
import shell from 'shelljs';

import config from './config';
import { api as api1, signOut as signOut1, signIn as signIn1 } from './api';
import { addTestData, deleteTestData } from './data/main';

// export var api: AxiosInstance;
export var data: Config.Data;

export function setup(context = {}) {
  jest.setTimeout(90 * 1000);
  beforeAll(async () => {
    try {
      if (config.createTestData) data = await addTestData();
      shell.exec('npm run build-yaml');
      jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
    } catch (error) {
      console.log('setup', error);
    }
  });

  afterAll(async () => {
    jest.setTimeout(30 * 1000);
    try {
      // if (config.createTestData) await deleteTestData(45);
      if (config.createTestData) await deleteTestData(data.test.id);
    } catch (error) {
      console.log('afterAll', error);
    }
  });

  return context;
}

// TODO: refactor
export var api: AxiosInstance;

export const signIn = async (userName?: string) => {
  await signIn1(userName);
  api = api1;
};

export const signOut = async () => {
  await signOut1();
};

export const setApi = signIn;

// export const signIn = async (userName?: string) => {
//   // sign in as userName and set the api global variable
//   const axiosData = 'email=' + userName + '&password=password&keepMeSignedIn=0';
//   const axiosConfig = {
//     baseURL: config.baseURL,
//     auth: config.auth,
//     headers: {
//       Cookie: '',
//     },
//   };
//   if (userName) {
//     const signInResponse = await axios.post('auth/sign-in', axiosData, axiosConfig);
//     const JSESSIONID = cookie.parse(signInResponse.headers['set-cookie'][0]).JSESSIONID;
//     axiosConfig.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
//   }
//   api = axios.create(axiosConfig);
//   // console.log('sign in successful');
// };

// export const setApi = signIn;

// export const signOut = async () => {
//   await api.post('user/sign-out');
//   // console.log('sign out successful');
// };
