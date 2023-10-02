import { setApi, setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('GET applications?schema=admin&filter[id][contains]=1', async () => {
    const response = await api.get('applications?schema=admin&filter[id][contains]=1');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET applications?schema=school&filter[id][contains]=1', async () => {
    const response = await api.get('applications?schema=school&filter[id][contains]=1');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET applications?schema=teacher&filter[id][contains]=1', async () => {
    const response = await api.get('applications?schema=teacher&filter[id][contains]=1');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET applications?schema=admin&filter[id][contains]=1...', async () => {
    const response = await api.get(
      'applications?schema=admin&filter[status.id][contains]=1&filter[job.school.name][matches]=alic'
    );
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  }, 10000);

  afterAll(async () => {
    await signOut();
  });
});
