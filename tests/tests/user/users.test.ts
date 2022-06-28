import { setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('GET v1/users/internal', async () => {
    const response = await api.get('v1/users/internal');
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

  test('GET v1/users/internal', async () => {
    const response = await api.get('v1/users/internal');
    expect(response.status).toEqual(403);
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

  test('GET v1/users/internal', async () => {
    const response = await api.get('v1/users/internal');
    expect(response.status).toEqual(403);
    expect(response).toSatisfyApiSpec();
  });

  afterAll(async() => {
    await signOut();
  });
});
