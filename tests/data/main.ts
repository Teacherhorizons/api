import cookie from 'cookie';
import querystring from 'querystring';

import { api, setApi, signOut, signIn } from './../api';
import { addApplication } from './application';
import { addApplicationEvent } from './applicationEvent';
import { addJob } from './job';
import { addSchool, updateSchool } from './school';
import { addTeacher } from './teacher';
import { addTest } from './test';

export const data: Config.Data = {
  schools: [],
  teachers: [],
  jobs: [],
  applications: [],
  applicationEvents: [],
};

export const getAddTestData = async (): Promise<Config.Data> => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // teachers
  await setApi();
  const teacher1: Config.Teacher = await addTeacher(api, 3); // deleteData
  // const teacher2: Config.Teacher = await addTeacher(api, 4); // deleteData
  // const teacher1: Config.Teacher = await addTeacher(api, 100); // storedData
  // const teacher2: Config.Teacher = await addTeacher(api, 101); // storedData
  // const teacher3: Config.Teacher = await addTeacher(api, 5);
  data.teachers.push(teacher1);
  // data.teachers.push(teacher2);
  // data.teachers.push(teacher3);
  await signOut();

  // sign in as admin
  await signIn('admin@th.test');

  // schools
  const school1: Config.School = await addSchool(api, 6); // deleteData
  // const school2: Config.School = await addSchool(api, 7); // deleteData
  // const school1: Config.School = await addSchool(api, 101); // storedData
  // const school2: Config.School = await addSchool(api, 102); // storedData
  // const school3: Config.School = await addSchool(api, 8);
  data.schools.push(school1);
  // data.schools.push(school2);
  // data.schools.push(school3);

  // updateSchool
  // await signIn('admin@th.test');
  updateSchool(api, 6, school1.id, teacher1.memberNumber, 1031); // deleteData
  // updateSchool(api, 7, school2.id, teacher1.memberNumber, 1031); // deleteData
  // updateSchool(api, 101, school1.id, teacher1.memberNumber, 1031); // storedData
  // updateSchool(api, 102, school2.id, teacher1.memberNumber, 1031); // storedData
  // updateSchool(api, 8, school3.id, 111059, 1059); //endorsed%@th.test memberNumber

  // jobs
  const job1: Config.Job = await addJob(api, 1, school1.id); // deleteData
  // const job2: Config.Job = await addJob(api, 2, school2.id); // deleteData
  // const job1: Config.Job = await addJob(api, 101, school1.id); // storedData
  // const job2: Config.Job = await addJob(api, 102, school2.id); // storedData
  // const job3: Config.Job = await addJob(api, 3, school3.id);
  data.jobs.push(job1);
  // data.jobs.push(job2);
  // data.jobs.push(job3);

  // applications
  const application1: Config.Application = await addApplication(api, job1.id, teacher1.memberNumber);
  // const application2: Config.Application = await addApplication(api, job2.id, teacher2.memberNumber);
  // const application3: Config.Application = await addApplication(api, job1.id, teacher1.memberNumber);
  // const application4: Config.Application = await addApplication(api, job1.id, 111059);
  // const application5: Config.Application = await addApplication(api, job1.id, teacher1.memberNumber);
  data.applications.push(application1);
  // data.applications.push(application2);
  // data.applications.push(application3);
  // data.applications.push(application4);
  // data.applications.push(application5);

  // applications-applicationEvents
  const applicationEvent1: Config.Application = await addApplicationEvent(
    api,
    application1.id,
    21,
    '2022-06-25T12:30:00.000Z'
  );
  // const applicationEvent2: Config.Application = await addApplicationEvent(
  //   api,
  //   application1.id,
  //   12,
  //   '2022-06-28T12:30:00.000Z'
  // );
  // const applicationEvent3: Config.Application = await addApplicationEvent(
  //   api,
  //   application1.id,
  //   23,
  //   '2022-06-30T12:30:00.000Z'
  // );
  // const applicationEvent4: Config.Application = await addApplicationEvent(
  //   api,
  //   application2.id,
  //   12,
  //   '2022-06-28T12:30:00.000Z'
  // );
  // const applicationEvent5: Config.Application = await addApplicationEvent(
  //   api,
  //   application3.id,
  //   12,
  //   '2022-05-28T12:30:00.000Z'
  // );
  // const applicationEvent6: Config.Application = await addApplicationEvent(
  //   api,
  //   application4.id,
  //   21,
  //   '2022-05-28T12:30:00.000Z'
  // );
  // const applicationEvent7: Config.Application = await addApplicationEvent(
  //   api,
  //   application5.id,
  //   8,
  //   '2022-05-28T12:30:00.000Z'
  // );
  // const applicationEvent8: Config.Application = await addApplicationEvent(
  //   api,
  //   application5.id,
  //   10,
  //   '2022-05-29T12:30:00.000Z'
  // );
  data.applicationEvents.push(applicationEvent1);
  // data.applicationEvents.push(applicationEvent2);
  // data.applicationEvents.push(applicationEvent3);
  // data.applicationEvents.push(applicationEvent4);
  // data.applicationEvents.push(applicationEvent5);
  // data.applicationEvents.push(applicationEvent6);
  // data.applicationEvents.push(applicationEvent7);
  // data.applicationEvents.push(applicationEvent8);

  // tests
  const test1: Config.Test = await addTest(api, data);
  data.test = test1;

  console.log('addTestData', JSON.stringify(data));
  return data;
};
// start before here:
export async function addTestData() {
  // teachers
  await setApi();
  const teacher1: Config.Teacher = await addTeacher(api, 3); // deleteData
  // const teacher2: Config.Teacher = await addTeacher(api, 4); // deleteData
  // const teacher1: Config.Teacher = await addTeacher(api, 100); // storedData
  // const teacher2: Config.Teacher = await addTeacher(api, 101); // storedData
  // const teacher3: Config.Teacher = await addTeacher(api, 5);
  data.teachers.push(teacher1);
  // data.teachers.push(teacher2);
  // data.teachers.push(teacher3);
  await signOut();

  // sign in as admin
  await signIn('admin@th.test');

  // schools
  const school1: Config.School = await addSchool(api, 6); // deleteData
  // const school2: Config.School = await addSchool(api, 7); // deleteData
  // const school1: Config.School = await addSchool(api, 101); // storedData
  // const school2: Config.School = await addSchool(api, 102); // storedData
  // const school3: Config.School = await addSchool(api, 8);
  data.schools.push(school1);
  // data.schools.push(school2);
  // data.schools.push(school3);

  // updateSchool
  // await signIn('admin@th.test');
  updateSchool(api, 6, school1.id, teacher1.memberNumber, 1031); // deleteData
  // updateSchool(api, 7, school2.id, teacher1.memberNumber, 1031); // deleteData
  // updateSchool(api, 101, school1.id, teacher1.memberNumber, 1031); // storedData
  // updateSchool(api, 102, school2.id, teacher1.memberNumber, 1031); // storedData
  // updateSchool(api, 8, school3.id, 111059, 1059); //endorsed%@th.test memberNumber

  // jobs
  const job1: Config.Job = await addJob(api, 1, school1.id); // deleteData
  // const job2: Config.Job = await addJob(api, 2, school2.id); // deleteData
  // const job1: Config.Job = await addJob(api, 101, school1.id); // storedData
  // const job2: Config.Job = await addJob(api, 102, school2.id); // storedData
  // const job3: Config.Job = await addJob(api, 3, school3.id);
  data.jobs.push(job1);
  // data.jobs.push(job2);
  // data.jobs.push(job3);

  // applications
  const application1: Config.Application = await addApplication(api, job1.id, teacher1.memberNumber);
  // const application2: Config.Application = await addApplication(api, job2.id, teacher2.memberNumber);
  // const application3: Config.Application = await addApplication(api, job1.id, teacher1.memberNumber);
  // const application4: Config.Application = await addApplication(api, job1.id, 111059);
  // const application5: Config.Application = await addApplication(api, job1.id, teacher1.memberNumber);
  data.applications.push(application1);
  // data.applications.push(application2);
  // data.applications.push(application3);
  // data.applications.push(application4);
  // data.applications.push(application5);

  // applications-applicationEvents
  const applicationEvent1: Config.Application = await addApplicationEvent(
    api,
    application1.id,
    21,
    '2022-06-25T12:30:00.000Z'
  );
  // const applicationEvent2: Config.Application = await addApplicationEvent(
  //   api,
  //   application1.id,
  //   12,
  //   '2022-06-28T12:30:00.000Z'
  // );
  // const applicationEvent3: Config.Application = await addApplicationEvent(
  //   api,
  //   application1.id,
  //   23,
  //   '2022-06-30T12:30:00.000Z'
  // );
  // const applicationEvent4: Config.Application = await addApplicationEvent(
  //   api,
  //   application2.id,
  //   12,
  //   '2022-06-28T12:30:00.000Z'
  // );
  // const applicationEvent5: Config.Application = await addApplicationEvent(
  //   api,
  //   application3.id,
  //   12,
  //   '2022-05-28T12:30:00.000Z'
  // );
  // const applicationEvent6: Config.Application = await addApplicationEvent(
  //   api,
  //   application4.id,
  //   21,
  //   '2022-05-28T12:30:00.000Z'
  // );
  // const applicationEvent7: Config.Application = await addApplicationEvent(
  //   api,
  //   application5.id,
  //   8,
  //   '2022-05-28T12:30:00.000Z'
  // );
  // const applicationEvent8: Config.Application = await addApplicationEvent(
  //   api,
  //   application5.id,
  //   10,
  //   '2022-05-29T12:30:00.000Z'
  // );
  data.applicationEvents.push(applicationEvent1);
  // data.applicationEvents.push(applicationEvent2);
  // data.applicationEvents.push(applicationEvent3);
  // data.applicationEvents.push(applicationEvent4);
  // data.applicationEvents.push(applicationEvent5);
  // data.applicationEvents.push(applicationEvent6);
  // data.applicationEvents.push(applicationEvent7);
  // data.applicationEvents.push(applicationEvent8);

  // tests
  const test1: Config.Test = await addTest(api, data);
  data.test = test1;

  console.log('addTestData', JSON.stringify(data));
  return data;
}

// const addTest = async (data: Config.Data): Promise<Config.Test> => {
//   const payload = {
//     data: {
//       type: 'test-apiTests',
//       attributes: {
//         dataIds: `{
//          "jobIds": [${data.jobs.map((x) => x.id)}],
//          "schoolIds": [${data.schools.map((x) => x.id)}],
//          "teacherMemberNumbers": [${data.teachers.map((x) => x.memberNumber)}],
//          "applicationIds": [${data.applications.map((x) => x.id)}]
//         }`,
//       },
//     },
//   };
//   try {
//     const response = await api.post('/test-apiTests', payload);
//     return {
//       id: response.data.data.id,
//     };
//   } catch (error) {
//     console.log('addTest', error);
//   }
// };

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
// const addJob = async (num: number, schoolIdValue: number): Promise<Config.Job> => {
//   const data = {
//     schoolId: schoolIdValue,
//     // schoolId: 2520,
//     title: 'Test job ' + num,
//     roleId: 1,
//     advertExpiryDate: '2022-07-22',
//     startDate: '2022-08-02',
//     deadlineDate: '2022-07-01',
//     jobTypeId: 1,
//     thOwnerUserId: 2,
//     excludeFromJobSearch: 0,
//     furtherInfo: '<div><p>tttt</p></div>',
//     subjectIds: [4],
//   };
//   const payload = { data: JSON.stringify(data) };
//   try {
//     const response = await api.post('v2/jobs/add', querystring.stringify(payload));
//     return {
//       id: response.data.jobs[0].id,
//     };
//   } catch (error) {
//     console.log('addJob', error);
//   }
// };

// const addTeacher = async (num: number): Promise<Config.Teacher> => {
//   const payload = {
//     keepMeSignedIn: false,
//     firstName: 'Test',
//     lastName: 'Teacher' + num,
//     email: 'teacher' + num + '@th.test',
//     password: 'password',
//     agreeTerms: true,
//     type: 'Teacher',
//   };
//   try {
//     await signOut();
//     const joinResponse = await api.post('user/join', querystring.stringify(payload));
//     const JSESSIONID = cookie.parse(joinResponse.headers['set-cookie'][0]).JSESSIONID;
//     // @ts-ignore:next-line
//     api.defaults.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
//     const userResponse = await api.get('v1/user/bundle');
//     return { memberNumber: userResponse.data.memberno };
//   } catch (error) {
//     console.log('addTeacher', error);
//   }
// };

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

// const addApplication = async (jobId: number, memberNumber: number): Promise<Config.Application> => {
//   const payload = {
//     data: {
//       type: 'application',
//       attributes: {
//         job: { id: `${jobId}` },
//         memberNumber: memberNumber,
//         // job: { id: '1547' },
//         // memberNumber: 1314160,
//       },
//     },
//   };
//   try {
//     const response = await api.post('applications', payload);
//     console.log('addApplicationSuccess', response.data.data.id);
//     return {
//       id: response.data.data.id,
//     };
//   } catch (error) {
//     console.log('addApplication', error);
//   }
// };

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
