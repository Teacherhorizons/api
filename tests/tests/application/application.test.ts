import { setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('GET applications/1?schema=admin', async () => {
    const response = await api.get('applications/1?schema=admin');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });
  
  test('GET applications/1?schema=school', async () => {
    const response = await api.get('applications/1?schema=school');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });
  
  test('GET applications/1?schema=teacher', async () => {
    const response = await api.get('applications/1?schema=teacher');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });
  
  test('GET applications/1, no schema', async () => {
    try {
      await api.get('applications/1');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    };
  });
  
  test('POST applications', async () => {
    const payload = {"data":{"type":"application","attributes":{"job":{"id":"1549"},"memberNumber":111627}}};
    const response = await api.post('applications', payload);
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  afterAll(async() => {
    await signOut();
  });
});

describe('endorsed@th.test', () => {
  beforeAll(async () => {
    await signIn('endorsed@th.test');
  });

  test('GET applications/8?schema=teacher', async () => {
    const response = await api.get('applications/8?schema=teacher');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET applications/1?schema=teacher', async () => {
    try {
      await api.get('applications/1?schema=teacher');
    } catch (error) {
      expect(error.response.status).toEqual(401);
      expect(error.response).toSatisfyApiSpec();
    };
  });

  test('GET applications/1?schema=admin', async () => {
    try {
      await api.get('applications/1?schema=admin');
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response).toSatisfyApiSpec();
    };
  });

  test('POST applications', async () => {
    try {
      const payload = {"data":{"type":"application","attributes":{"job":{"id":"1549"},"memberNumber":111627}}};
      await api.post('applications', payload);
    } catch (error) {
      expect(error.response.status).toEqual(401);
      expect(error.response).toSatisfyApiSpec();
    };
  });

  afterAll(async() => {
    await signOut();
  });
});