import { setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('GET application-applicationEvents?schema=admin-oneApplication&filter[application.id]=1', async () => {
    const response = await api.get('application-applicationEvents?schema=admin-oneApplication&filter[application.id]=1');
    // expect(response.status).toEqual(200);
    expect(response.status).toEqual(201);
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

  test('GET application-applicationEvents?schema=school&filter[application.id]=16', async () => {
    const response = await api.get('application-applicationEvents?schema=school&filter[application.id]=16');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET application-applicationEvents?schema=school&filter[application.id]=1', async () => {
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
