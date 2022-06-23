import { setup, api } from '../../shared';

setup();

test('GET applications?schema=admin&filter[id][contains]=1', async () => {
  const response = await api.get('applications?schema=admin&filter[id][contains]=1');
  expect(response.status).toEqual(200);
  expect(response).toSatisfyApiSpec();
});

test('GET applications?schema=admin&filter[id][contains]=1...', async () => {
  const response = await api.get('applications?schema=admin&filter[status.id][contains]=1&filter[job.school.name][matches]=alic');
  expect(response.status).toEqual(200);
  expect(response).toSatisfyApiSpec();
});
