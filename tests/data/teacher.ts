import { AxiosInstance } from 'axios';
import cookie from 'cookie';
import querystring from 'querystring';

import { signOut } from './../api';

export const addTeacher = async (api: AxiosInstance, num: number): Promise<Config.Teacher> => {
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
