import { setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('GET application-applicationEvents?schema=admin-oneApplication&filter[application.id]=30', async () => {
    const response = await api.get('application-applicationEvents?schema=admin-oneApplication&filter[application.id]=30');
    expect(response.status).toEqual(200);
    expect(response.data.data.length).toEqual(4);
    expect(response).toSatisfyApiSpec();
  });

  test('GET application-applicationEvents?schema=school&filter[application.id]=30', async () => {
    const response = await api.get('application-applicationEvents?schema=school&filter[application.id]=30');
    expect(response.status).toEqual(200);
    expect(response.data.data.length).toEqual(3);
    expect(response).toSatisfyApiSpec();
  });
  
  test('GET application-applicationEvents?schema=admin-allApplications&filter[application.teacher.memberNumber]=1314161', async () => {
    const response = await api.get('application-applicationEvents?schema=admin-allApplications&filter[application.teacher.memberNumber]=1314161');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });
  
  afterAll(async() => {
    await signOut();
  });
});

describe('school-1-school@th.test', () => {
  beforeAll(async () => {
    await signIn('school-1-school@th.test');
  });

  test('GET applicationEvents for application user can see (200)', async () => {
    // TODO: consider using variables rather than hard-coded ids (perhaps linked to test data)
    const response = await api.get('application-applicationEvents?schema=school&filter[application.id]=30');
    expect(response.status).toEqual(200);
    expect(response.data.data.length).toEqual(3);
    expect(response).toSatisfyApiSpec();
  });

  test('GET applicationEvents for application not yet submitted to the school (401)', async () => {
    try {
      await api.get('application-applicationEvents?schema=school&filter[application.id]=16');
    } catch (error) {
      expect(error.response.status).toEqual(401);
      expect(error.response).toSatisfyApiSpec();
    };
  });

  test('GET applicationEvents for application unrelated to this user (401)', async () => {
    try {
      await api.get('application-applicationEvents?schema=school&filter[application.id]=1');
    } catch (error) {
      expect(error.response.status).toEqual(401);
      expect(error.response).toSatisfyApiSpec();
    };
  });
  
  afterAll(async() => {
    await signOut();
  });
});
