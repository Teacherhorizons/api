import { AxiosInstance } from 'axios';

export const addApplication = async (
  api: AxiosInstance,
  jobId: number,
  memberNumber: number
): Promise<Config.Application> => {
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
