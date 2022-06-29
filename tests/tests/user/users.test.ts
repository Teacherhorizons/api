import { setApi, setup, signIn, signOut, api } from '../../shared';

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
    try {
      await api.get('v1/users/internal');
    } catch (error) {
      expect(error.response.status).toEqual(403);
      // expect(error.response).toSatisfyApiSpec(); - TODO - add later
      // actual response: {"error":"User not authorized to make this call - not logged in","frontEndErrorSlug":"insufficientPermissions"}
    };
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
    try {
      await api.get('v1/users/internal');
    } catch (error) {
      expect(error.response.status).toEqual(403);
      // expect(error.response).toSatisfyApiSpec(); - TODO - add later
    };
  });

  afterAll(async() => {
    await signOut();
  });
});

describe('not signed in', () => {
  beforeAll(async () => {
    await setApi();
  });

  test('GET v1/users/internal', async () => {
    try {
      await api.get('v1/users/internal');
    } catch (error) {
      expect(error.response.status).toEqual(403);
      // expect(error.response).toSatisfyApiSpec(); - TODO - add later
      // actual response: {"error":"User not authorized to make this call - not logged in","frontEndErrorSlug":"insufficientPermissions"}
    };
  });

  afterAll(async() => {
    await signOut();
  });
});
