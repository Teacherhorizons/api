import { addTestGroups, api, setupBeforeAll, signIn, data, compareFnGenerator, signedInAs } from '../../shared';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-oneApplication&filter[application.id]=${data.applications[0].id}`,
      tests: [
        {
          name: 'schema=admin-oneApplication',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 4,
        },
        {
          name: 'schema=admin-oneApplication',
          userEmail: 'school1@th.test',
          expectedStatus: 401,
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationEvents?schema=admin-oneApplication&filter[application.id]=${data.applications[1].id}`,
      tests: [
        {
          name: 'schema=admin-oneApplication',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 2,
        },
        {
          name: 'schema=admin-oneApplication',
          userEmail: 'school1@th.test',
          expectedStatus: 401,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?schema=school&filter[application.id]=${data.applications[0].id}`,
      tests: [
        {
          name: 'schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          expectedDataLength: 3,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
testsForGet = [testsForGet[0]]; // TEMP
jest.setTimeout(60 * 1000);

describe('applicationEvents', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);
      expect(response.data.data.length).toEqual(t.expectedDataLength);
      expect(response).toSatisfyApiSpec();
    } else {
      try {
        await api.get(url);
      } catch (error) {
        expect(error.response.status).toEqual(t.expectedStatus);
        expect(error.response).toSatisfyApiSpec();
      }
    }
  });
});
