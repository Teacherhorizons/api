import axios from 'axios';
import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';
import querystring from 'querystring';
import shell from 'shelljs';

import config from './config';

export var api;

export function setup(context = {}) {
  beforeAll(async () => {
    try {
      // await addTestData();
      shell.exec("npm run build-yaml");
      jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
    } catch (error) {
      console.log(101, error);
    }
    // TODO: consider adding all created test data (somehow - needs to have ids which match tests)
  });

  afterAll(() => {
    // remove all created test data
  });

  return context;
}

async function addTestData()  {
  /*
    config.schools[0].id = addSchool({name: 'School 1', ...});
    config.schools[1].id = addSchool({name: 'School 1', ...});
    
    jobId = addJob({schoolId: schoolId, title: '...', ...})
    memberNumber = addTeacher({name: 'Foo Bar', ...})
    applicationId = addApplication({jobId: jobId, memberNumber: memberNumber})
  */
  setApi();
  const memberNumber1 = await addTeacher(1);
  const memberNumber2 = await addTeacher(2);

  config.data.teachers.push({ memberNumber: memberNumber1 });
  config.data.teachers.push({ memberNumber: memberNumber2 });

  console.log(104, config);

  // TODO: consider capturing added ids and then using those ids in the tests
  // const payload = {
  //   data: {
  //     type: 'application',
  //     attributes: { job: { id: '1549' }, memberNumber: 111627 },
  //   },
  // }
  // const response = await api.post('applications', payload);
}

const addTeacher = async (num: number): Promise<number> => {
  const payload = {
    keepMeSignedIn: false,
    firstName: 'Test',
    lastName: 'Teacher' + num,
    email: 'teacher' + num + '@th.test',
    password: 'password',
    agreeTerms: true,
    type: 'Teacher'
  }
  try {
    await signOut();
    const joinResponse = await api.post('user/join', querystring.stringify(payload));
    const JSESSIONID = cookie.parse(joinResponse.headers['set-cookie'][0]).JSESSIONID;
    api.defaults.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
    const userResponse = await api.get('v1/user/bundle');
    return userResponse.data.memberno;
  } catch (error) {
    console.log('addTeacher', error);
  }
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

