import { setApi, setup, signIn, signOut, api } from '../../shared';

setup();

describe('not signed in', () => {
  beforeAll(async () => {
    await setApi();
  });

  test('GET v1/lists?key=subjects', async () => {
    const response = await api.get('v1/lists?key=subjects');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET v1/lists?key=cities,countries,regions', async () => {
    const response = await api.get('v1/lists?key=cities,countries,regions');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET v1/lists?key=applicationStatuses', async () => {
    const response = await api.get('v1/lists?key=applicationStatuses');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET v1/lists?key=applicationThMatchTypes', async () => {
    const response = await api.get('v1/lists?key=applicationThMatchTypes');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  // test('GET v1/lists?key=applicationEventAutoEmails', async () => {
  //   const response = await api.get('v1/lists?key=applicationEventAutoEmails');
  //   expect(response.status).toEqual(200);
  //   expect(response).toSatisfyApiSpec();
  // });

  test('GET v1/lists?key=jobStatuses', async () => {
    const response = await api.get('v1/lists?key=jobStatuses');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });

  test('GET v1/lists?key=applicationEventTypes', async () => {
    const response = await api.get('v1/lists?key=applicationEventTypes');
    expect(response.status).toEqual(200);
    expect(response).toSatisfyApiSpec();
  });
});
