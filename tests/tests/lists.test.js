const jestOpenAPI = require('jest-openapi').default;
const path = require('path');
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://beta.teacherhorizons.com/th/api/',
  proxy: {
    auth: { username: 'beta-tester', password: 'th2015th' }
  },
  headers: {
    Cookie: "JSESSIONID=3B5FABEE7B4341800CA351448C37FDC5;"
  },
});

jestOpenAPI(path.join(process.cwd(), 'openapi.yaml'));

test('GET lists API response should satisfy OpenAPI spec', async () => {
  // works
  const res = await api.get('v1/lists?key=regions');
  expect(res.status).toEqual(200);
  expect(res).toSatisfyApiSpec();
});


// foo = (requestUrlStub) => {
//   const res = await api.get(requestUrlStub);
//   expect(res.status).toEqual(200);
//   expect(res).toSatisfyApiSpec();
// };

/* Notes:
  - 'https://www.teacherhorizons.com/th/api/v1/lists?key=regions' - works
  - 'https://beta.teacherhorizons.com/th/api/v1/lists?key=regions' - works

  - 'https://www.teacherhorizons.com/th/api/applications/209510' - doesn't work due to permission?
  - 'https://beta.teacherhorizons.com/th/api/applications/1' - doesn't work due to permission?

  - useful terminal commands
    + npm test (run all tests)
    + npm test -- lists.test.js (run tests in a single file)
    + npm test -- -t "GET users API response" (run test matching this text)
*/
/* no longer needed code
  // withCredentials: true,
  // headers: {
  //   post: {
  //     "Access-Control-Allow-Origin": true
  //   }
  // }

  // let res;
  // try {
  //   res = await api.get('/v1/lists?key=regions');
  // } catch (error) {
  //   console.log(101, error);
  // };
*/