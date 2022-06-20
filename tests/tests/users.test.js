const jestOpenAPI = require('jest-openapi').default;
const path = require('path');
const axios = require('axios');

const getUsers_200a = require('../responses/getUsers_200a.json');
const getUsers_200b = require('../responses/getUsers_200b.json');

jestOpenAPI(path.join(process.cwd(), 'openapi.yaml'));

test('getUsers_200 object should satisfy getUsers_200 spec', async () => {
  const getUsers_200 = [
    {
      id: '1',
      createdAt: 1503488578,
      name: 'name 1',
      imageUrl: '...',
    },
  ];
  expect(getUsers_200).toSatisfySchemaInApiSpec('getUsers_200');
});

test('responses/getUsers_200a.json should satisfy getUsers_200 spec', async () => {
  expect(getUsers_200a).toSatisfySchemaInApiSpec('getUsers_200');
});

test('responses/getUsers_200b.json should NOT satisfy getUsers_200 spec', async () => {
  expect(getUsers_200b).not.toSatisfySchemaInApiSpec('getUsers_200');
});

test('GET users API response should satisfy OpenAPI spec', async () => {
  const res = await axios.get(
    'https://599d6a620a785b0011f4f6c8.mockapi.io/users'
  );
  expect(res.status).toEqual(200);
  expect(res).toSatisfyApiSpec();
});
