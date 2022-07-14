import { AxiosInstance } from 'axios';
import querystring from 'querystring';

export const addSchool = async (api: AxiosInstance, num: number): Promise<Config.School> => {
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
