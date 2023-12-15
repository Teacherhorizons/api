import { ResourceObject } from 'ts-json-api';

import {
  addTestGroups,
  api,
  setupAfterAll,
  setupBeforeAll,
  signIn,
  data,
  compareFnGenerator,
  signedInAs,
  getIsResponseValid,
} from '../../shared';

var testsForGet = addTestGroups(
  [],
  [
    // {
    //   getUrl: (data) => `teachers/${data.teachers[2].id}`,
    //   tests: [
    //     {
    //       name: 'teachers - no schema',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 400, // missingMandatoryParameter - schema
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `teachers/foo`,
    //   tests: [
    //     {
    //       name: 'teachers/foo',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 400, // invalidParameterValue - userId
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `teachers/${data.teachers[2].id}?schema=foo`,
    //   tests: [
    //     {
    //       name: 'teachers/${data.teachers[2].id}?schema=foo',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 400, // invalidParameterValue - schema
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `teachers/${data.teachers[2].id}?schema=default`,
    //   tests: [
    //     {
    //       name: 'teachers/${data.teachers[2].id}?schema=default',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 200,
    //       getPassesCustomChecks(response, data) {
    //         const responseData = response.data as ResourceObject;
    //         return responseData.attributes.photo === undefined;
    //       },
    //     },
    //   ],
    // },
    {
      getUrl: (data) => `teachers/${data.teachers[2].id}?schema=default&include=photo`,
      tests: [
        {
          name: 'teachers/${data.teachers[2].id}?schema=default&include=photo',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const responseData = response.data as ResourceObject;
            return !!responseData.attributes.photo;
          },
        },
      ],
    },
    // {
    //   getUrl: (data) => `teachers/${data.teachers[2].id}?schema=default&include=explorerSummary`,
    //   tests: [
    //     {
    //       name: 'teachers/${data.teachers[2].id}?schema=default&include=explorerSummary',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 200,
    //       getPassesCustomChecks(response, data) {
    //         const responseData = response.data as ResourceObject;
    //         return responseData.attributes.photo === undefined;
    //       },
    //     },
    //   ],
    // },
    {
      getUrl: (data) => `teachers/${data.teachers[2].id}?schema=default&include=upcomingExplorerInterviews`,
      tests: [
        {
          name: 'teachers/${data.teachers[2].id}?schema=default&include=upcomingExplorerInterviews',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const responseData = response.data as ResourceObject;
            return responseData.attributes.photo === undefined;
          },
        },
      ],
    },
    // {
    //   getUrl: (data) =>
    //     `teachers/${data.teachers[2].id}?schema=default&include=photo,explorerSummary,upcomingExplorerInterviews`,
    //   tests: [
    //     {
    //       name: 'teachers/${data.teachers[2].id}?schema=default&include=photo,explorerSummary,upcomingExplorerInterviews',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 200,
    //     },
    //   ],
    // },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('teachers', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$name => $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);

      if (t.getPassesCustomChecks) {
        expect(t.getPassesCustomChecks(response.data, data)).toBe(true);
      }

      const isResponseValid = getIsResponseValid(response.data);
      expect(isResponseValid).toBe(true);

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

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await setupAfterAll();
  });
});
