import { setup, api } from '../shared';

setup();

test('GET application API response should satisfy OpenAPI spec', async () => {
  const response = await api.get('applications/1?schema=school');
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
