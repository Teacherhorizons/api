import { setup, signIn, signOut, api } from '../../shared';

setup();

describe('admin@th.test', () => {
  beforeAll(async () => {
    await signIn('admin@th.test');
  });

  test('GET application-eventTypeActions?schema=admin', async () => {
    const response = await api.get('application-eventTypeActions?schema=admin');
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

  test('GET application-eventTypeActions?schema=school', async () => {
    const response = await api.get('application-eventTypeActions?schema=school');
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

  test('GET application-eventTypeActions?schema=teacher', async () => {
    const response = await api.get('application-eventTypeActions?schema=teacher');
    expect(response.status).toEqual(403);
    expect(response).toSatisfyApiSpec();
  });

  afterAll(async() => {
    await signOut();
  });
});
