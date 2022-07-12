import axios, { AxiosInstance } from 'axios';
import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';
import querystring from 'querystring';
import shell from 'shelljs';

// import { Test, Job, School, Teacher, Data } from './interfaces';
import config from './config';

export var api: AxiosInstance;

const data: Config.Data = {
  schools: [],
  teachers: [],
  jobs: [],
};

export function setup(context = {}) {
  beforeAll(async () => {
    try {
      if (config.createTestData) await addTestData();
      shell.exec('npm run build-yaml');
      jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
    } catch (error) {
      console.log(101, error);
    }
  });

  afterAll(async () => {
    if (config.createTestData) await deleteTestData(data.test?.id);
  });

  return context;
}

async function addTestData() {
  // // teachers
  // await setApi();
  // const teacher1 = await addTeacher(3);
  // const teacher2 = await addTeacher(4);
  // data.teachers.push(teacher1);
  // data.teachers.push(teacher2);
  // await signOut();

  // sign in as admin
  await signIn('admin@th.test');

  // // schools
  // const school1: School = await addSchool(6);
  // const school2: School = await addSchool(7);
  // data.schools.push(school1);
  // data.schools.push(school2);

  // jobs
  const job1: Config.Job = await addJob(1);
  data.jobs.push(job1);

  const test: Config.Test = await addTest(data);

  console.log(104, JSON.stringify(data));
}

const addTest = async (data: Config.Data): Promise<Config.Test> => {
  const payload = {
    schoolIds: data.schools.map((x) => x.id),
    teacherMemberNumbers: data.teachers.map((x) => x.memberNumber),
    jobIds: data.jobs.map((x) => x.id),
    // ...
  };
  console.log(102, payload);
  try {
    const response = await api.post('/test-apiTests', querystring.stringify(payload));
    console.log(101, response.data);
    return {
      id: 123,
    };
  } catch (error) {
    console.log('addTest', error);
  }
};

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
const addJob = async (num: number): Promise<Config.Job> => {
  const data = {
    schoolId: 2520,
    title: 'Test job ' + num,
    roleId: 1,
    advertExpiryDate: '2022-07-22',
    startDate: '2022-08-02',
    deadlineDate: '2022-07-01',
    jobTypeId: 1,
    thOwnerUserId: 2,
    excludeFromJobSearch: 0,
    furtherInfo: '<div><p>tttt</p></div>',
    subjectIds: [4],
  };
  const payload = { data: JSON.stringify(data) };
  try {
    const response = await api.post('v2/jobs/add', querystring.stringify(payload));
    return {
      id: response.data.jobs[0].id,
    };
  } catch (error) {
    console.log('addJob', error);
  }
};

const addSchool = async (num: number): Promise<Config.School> => {
  const payload = {
    continent: 4,
    country: 23,
    'city.id': 86,
    'data.city.id': 86,
    name: 'My test school ' + num,
  };
  try {
    await api.get('admin/listing/Schools/edit/0');
    await api.post('admin/listing/Schools/edit/0', querystring.stringify(payload));
    const getResponse = await api.get('/v3/school/slug/europe-germany-berlin-my-test-school-' + num + '/profile');

    return {
      id: getResponse.data.school.schoolId,
      slug: getResponse.data.school.slug,
    };
  } catch (error) {
    console.log('addSchool', error);
  }
};

const addTeacher = async (num: number): Promise<Config.Teacher> => {
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
    const joinResponse = await api.post('user/join', querystring.stringify(payload));
    const JSESSIONID = cookie.parse(joinResponse.headers['set-cookie'][0]).JSESSIONID;
    // TODO: check this change (needed for typescript) doesn't break things
    api.defaults.headers.common['Cookie'] = 'JSESSIONID=' + JSESSIONID;
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

const deleteTestData = async (testId: number): Promise<Boolean> => {
  try {
    const response = await api.delete('test-apiTests/' + testId);
    console.log(101, response.data);
    return true;
  } catch (error) {
    console.log('deleteTestData', error);
    return false;
  }
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
    const signInResponse = await axios.post('auth/sign-in', axiosData, axiosConfig);
    const JSESSIONID = cookie.parse(signInResponse.headers['set-cookie'][0]).JSESSIONID;
    axiosConfig.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
  }
  api = axios.create(axiosConfig);
};

export const setApi = signIn;

export const signOut = async () => {
  await api.post('user/sign-out');
  // await axios.post('user/sign-out')
};
