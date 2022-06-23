import { setup, api } from '../../shared';

setup();

test('GET v1/lists?key=regions', async () => {
  const response = await api.get('v1/lists?key=regions');
  expect(response.status).toEqual(200);
  expect(response).toSatisfyApiSpec();
});

// TODO: move
test('GET v1/site/statistics', async () => {
  const response = await api.get('v1/site/statistics');
  expect(response.status).toEqual(200);
  expect(response).toSatisfyApiSpec();
});
