import axios from 'axios';
import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';
import querystring from 'querystring';
import shell from 'shelljs';

import config from './config';
import { School, Teacher, data } from './data';

export var api;

export function setup(context = {}) {
  beforeAll(async () => {
    try {
      // await addTestData();
      shell.exec('npm run build-yaml');
      jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
    } catch (error) {
      console.log(101, error);
    }
  });

  afterAll(() => {
    // await deleteTestData();
  });

  return context;
}

async function addTestData() {
  // teachers
  await setApi();
  const teacher1 = await addTeacher(3);
  const teacher2 = await addTeacher(4);
  data.teachers.push(teacher1);
  data.teachers.push(teacher2);
  await signOut();

  // schools
  await signIn('admin@th.test');
  const school1: School = await addSchool(6);
  data.schools.push(school1);

  console.log(104, JSON.stringify(data));
}

/*
  [done] add school
    => add new api call: POST /schools
  [wip] get bunch of ids (2 * school id/slug, 2 * job id, 2 * teacher users, 2 * member number / teacherId, ... )
    => use existing api calls (mainly), or a new (a few)
  delete all added test data (matching those ids)
    => add new api call to add test ids: POST /tests
    => add new api call to delete test data: DELETE /tests/17
      => stored procedure spTest_deleteData
    => only allow api call on beta and local
*/

const addSchool = async (num: number): Promise<School> => {
  const payload = {
    continent: 4,
    country: 23,
    'city.id': 86,
    'data.city.id': 86,
    name: 'My test school ' + num,
  };
  try {
    await api.get('admin/listing/Schools/edit/0');
    await api.post(
      'admin/listing/Schools/edit/0',
      querystring.stringify(payload)
    );
    const getResponse = await api.get(
      '/v3/school/slug/europe-germany-berlin-my-test-school-' + num + '/profile'
    );

    return {
      id: getResponse.data.school.schoolId,
      slug: getResponse.data.school.slug,
    };
  } catch (error) {
    console.log('addSchool', error);
  }
};

const addTeacher = async (num: number): Promise<Teacher> => {
  const payload = {
    keepMeSignedIn: false,
    firstName: 'Test',
    lastName: 'Teacher' + num,
    email: 'teacher' + num + '@th.test',
    password: 'password',
    agreeTerms: true,
    type: 'Teacher',
  };
  try {
    await signOut();
    const joinResponse = await api.post(
      'user/join',
      querystring.stringify(payload)
    );
    const JSESSIONID = cookie.parse(
      joinResponse.headers['set-cookie'][0]
    ).JSESSIONID;
    api.defaults.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
    const userResponse = await api.get('v1/user/bundle');
    return { memberNumber: userResponse.data.memberno };
  } catch (error) {
    console.log('addTeacher', error);
  }
};

const addApplication = async (num: number): Promise<any> => {
  // TODO: consider capturing added ids and then using those ids in the tests
  // const payload = {
  //   data: {
  //     type: 'application',
  //     attributes: { job: { id: '1549' }, memberNumber: 111627 },
  //   },
  // }
  // const response = await api.post('applications', payload);
};

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
    const signInResponse = await axios.post(
      'auth/sign-in',
      axiosData,
      axiosConfig
    );
    const JSESSIONID = cookie.parse(
      signInResponse.headers['set-cookie'][0]
    ).JSESSIONID;
    axiosConfig.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
  }
  api = axios.create(axiosConfig);
};

export const setApi = signIn;

export const signOut = async () => {
  await api.post('user/sign-out');
};
