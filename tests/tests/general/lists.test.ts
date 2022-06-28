import { setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('GET v1/lists?key=subjects', async () => {
    const response = await api.get('v1/lists?key=subjects');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET v1/lists?key=applicationStatuses', async () => {
    const response = await api.get('v1/lists?key=applicationStatuses');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  afterAll(async() => {
    await signOut();
  });
});


// TODO RR
describe('not signed in', () => {
  beforeAll(async () => {
  });

  test('GET v1/lists?key=subjects', async () => {
    const response = await api.get('v1/lists?key=subjects');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });
});
