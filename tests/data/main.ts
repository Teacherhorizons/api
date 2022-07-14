import cookie from 'cookie';
import querystring from 'querystring';

import { api, setApi, signOut, signIn } from './../api';
import { addSchool } from './school';

export const data: Config.Data = {
  schools: [],
  teachers: [],
  jobs: [],
  applications: [],
};

export async function addTestData() {
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
  const school1: Config.School = await addSchool(api, 6);
  const school2: Config.School = await addSchool(api, 7);
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
  return data;
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

export const deleteTestData = async (testId: number): Promise<Boolean> => {
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
