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
  applications: [],
};

export function setup(context = {}) {
  jest.setTimeout(90 * 1000);
  beforeAll(async () => {
    try {
      if (config.createTestData) await addTestData();
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

async function addTestData() {
  // teachers
  await setApi();
  const teacher1: Config.Teacher = await addTeacher(3);
  const teacher2: Config.Teacher = await addTeacher(4);
  data.teachers.push(teacher1);
  data.teachers.push(teacher2);
  await signOut();
  // sign in as admin
  await signIn('admin@th.test');

  // schools
  const school1: Config.School = await addSchool(6);
  const school2: Config.School = await addSchool(7);
  data.schools.push(school1);
  data.schools.push(school2);

  // jobs
  const job1: Config.Job = await addJob(1, school1.id);
  const job2: Config.Job = await addJob(2, school2.id);
  data.jobs.push(job1);
  data.jobs.push(job2);

  // applications
  const application1: Config.Application = await addApplication(job1.id, teacher1.memberNumber);
  data.applications.push(application1);

  // tests
  const test1: Config.Test = await addTest(data);
  data.test = test1;

  console.log('addTestData', JSON.stringify(data));
}

const addTest = async (data: Config.Data): Promise<Config.Test> => {
  const payload = {
    data: {
      type: 'test-apiTests',
      attributes: {
        dataIds: `{
         "jobIds": [${data.jobs.map((x) => x.id)}],
         "schoolIds": [${data.schools.map((x) => x.id)}],
         "teacherMemberNumbers": [${data.teachers.map((x) => x.memberNumber)}],
         "applicationIds": [${data.applications.map((x) => x.id)}]
        }`,
      },
    },
  };
  try {
    const response = await api.post('/test-apiTests', payload);
    return {
      id: response.data.data.id,
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
const addJob = async (num: number, schoolIdValue: number): Promise<Config.Job> => {
  const data = {
    schoolId: schoolIdValue,
    // schoolId: 2520,
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
    // console.log('school get1 successful');
    try {
      await api.post('admin/listing/Schools/edit/0', querystring.stringify(payload));
    } catch (error) {
      console.log('continue school');
      // console.log('Addschool', error);
    }
    // console.log('school post1 successful');
    const getResponse = await api.get('/v3/school/slug/europe-germany-berlin-my-test-school-' + num + '/profile');
    // console.log('school get2 successful');
    console.log('school added successfully');
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
    // @ts-ignore:next-line
    api.defaults.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
    const userResponse = await api.get('v1/user/bundle');
    return { memberNumber: userResponse.data.memberno };
  } catch (error) {
    console.log('addTeacher', error);
  }
};

// const addApplication = async (num: number): Promise<any> => {
//   // TODO: consider capturing added ids and then using those ids in the tests
//   // const payload = {
//   //   data: {
//   //     type: 'application',
//   //     attributes: { job: { id: '1549' }, memberNumber: 111627 },
//   //   },
//   // }
//   // const response = await api.post('applications', payload);
// };

const addApplication = async (jobId: number, memberNumber: number): Promise<Config.Application> => {
  const payload = {
    data: {
      type: 'application',
      attributes: {
        job: { id: `${jobId}` },
        memberNumber: memberNumber,
        // job: { id: '1547' },
        // memberNumber: 1314160,
      },
    },
  };
  try {
    const response = await api.post('applications', payload);
    console.log('addApplicationSuccess', response.data.data.id);
    return {
      id: response.data.data.id,
    };
  } catch (error) {
    console.log('addApplication', error);
  }
};

const deleteTestData = async (testId: number): Promise<Boolean> => {
  try {
    await signIn('admin@th.test');
    const response = await api.delete('test-apiTests/' + testId);
    console.log('deleteTestDataSuccess', response.data);
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
  // console.log('sign in successful');
};

export const setApi = signIn;

export const signOut = async () => {
  await api.post('user/sign-out');
  // console.log('sign out successful');
};
