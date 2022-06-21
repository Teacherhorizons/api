import { setup, api } from '../shared';

setup();

test('GET applications/1?schema=school', async () => {
  const response = await api.get('applications/1?schema=school');
  expect(response.status).toEqual(200);
  expect(response).toSatisfyApiSpec();
});

test('GET applications/1?schema=admin', async () => {
  const response = await api.get('applications/1?schema=admin');
  expect(response.status).toEqual(200);
  expect(response).toSatisfyApiSpec();
});

test('GET applications?schema=admin&filter[id][contains]=1', async () => {
  const response = await api.get('applications?schema=admin&filter[id][contains]=1');
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
