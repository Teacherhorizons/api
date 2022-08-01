import { AxiosInstance } from 'axios';
import querystring from 'querystring';

export const addJob = async (api: AxiosInstance, num: number, schoolIdValue: number): Promise<Config.Job> => {
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
