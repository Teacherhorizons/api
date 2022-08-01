import { AxiosInstance } from 'axios';

export const addApplicationEvent = async (
  api: AxiosInstance,
  applicationId: number,
  eventTypeId: number,
  dateTime: string
): Promise<Config.Application> => {
  const payload = {
    data: {
      type: 'application-applicationEvent',
      attributes: {
        application: { id: `${applicationId}` },
        // application: { id: '1211' },
        eventType: { id: `${eventTypeId}` },
        date: `${dateTime}`,
        // date: '2022-06-27T12:30:00.000Z',
        notes: 'FooBasr',
        autoEmail: { id: '42' },
      },
    },
  };

  try {
    const response = await api.post('application-applicationEvents', payload);
    console.log('addApplicationEventSuccess', response.data.data.id);
    return {
      id: response.data.data.id,
    };
  } catch (error) {
    console.log('addApplication', error);
  }
};
