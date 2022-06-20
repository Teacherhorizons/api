import { setup, api } from '../shared';

setup();

test('GET lists API response should satisfy OpenAPI spec', async () => {
  const response = await api.get('v1/lists?key=regions');
  expect(response.status).toEqual(200);
  expect(response).toSatisfyApiSpec();
});
