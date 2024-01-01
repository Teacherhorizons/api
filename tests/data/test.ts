import { AxiosInstance } from 'axios';

export const addTest = async (api: AxiosInstance, data: Config.Data): Promise<Config.Test> => {
  const payload = {
    data: {
      type: 'test-apiTests',
      attributes: {
        dataIds: `{
         "jobIds": [${data.jobs.map((x) => x.id)}],
         "schoolIds": [${data.schools.map((x) => x.id)}],
         "teacherMemberNumbers": [${data.teachers.map((x) => x.memberNumber)}],
         "applicationIds": [${data.applications.map((x) => x.id)}],
         "applicationEventIds": [${data.applicationEvents.map((x) => x.id)}]
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

export const addSingleTest = async (api: AxiosInstance, ids: number[], nameIds: string): Promise<Config.Test> => {
  const payload = {
    data: {
      type: 'test-apiTests',
      attributes: {
        dataIds: `{"${nameIds}": [${ids}]}`,
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
