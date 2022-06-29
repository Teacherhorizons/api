import axios from 'axios';
import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';

import config from './config';

export var api;

export function setup(context = {}) {
  beforeAll(() => {
    jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
    // TODO: consider adding all created test data (somehow - needs to have ids which match tests)
  });

  afterAll(() => {
    // remove all created test data
  });

  return context;
}

async function addTestData()  {
  // TODO: consider capturing added ids and then using those ids in the tests
  const payload = {
    data: {
      type: 'application',
      attributes: { job: { id: '1549' }, memberNumber: 111627 },
    },
  }
  const response = await api.post('applications', payload);
}

export const signIn = async (userName?: string) => {
  // sign in as userName and set the api global variable
  const axiosData = 'email='+userName+'&password=password&keepMeSignedIn=0';
  const axiosConfig = {
    baseURL: config.baseURL,
    auth: config.auth,
    headers: {
      Cookie: '',
    }
  };
  if (userName) {
    const signInResponse = await axios.post('auth/sign-in', axiosData, axiosConfig);
    const JSESSIONID = cookie.parse(signInResponse.headers['set-cookie'][0]).JSESSIONID;
    axiosConfig.headers.Cookie = 'JSESSIONID=' + JSESSIONID;  
  }
  api = axios.create(axiosConfig);
}

export const setApi = signIn;

export const signOut = async () => {
  await api.post('user/sign-out');
}

