import {
  addTestGroups,
  api,
  setupAfterAll,
  setupBeforeAll,
  signIn,
  data,
  compareFnGenerator,
  signedInAs,
} from '../../shared';

import config from '../../config';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationDataIssues`,
      tests: [
        {
          name: 'application-applicationDataIssues',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'application-applicationDataIssues',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'application-applicationDataIssues',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'application-applicationDataIssues',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?schema=admin-v2`,
      tests: [
        {
          name: 'schema=admin-v2',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        // {
        //   name: 'schema=admin-v2',
        //   userEmail: 'admin@th.test',
        //   expectedStatus: 400, //missingMandatoryParameter	filter[application.id] must be passed
        // },
        {
          name: 'schema=admin-v2',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'schema=admin-v2',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?schema=teacher`,
      tests: [
        {
          name: 'schema=teacher',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter schema must be correct
        },
        {
          name: 'schema=teacher',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter schema must be correct
        },
        {
          name: 'schema=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter schema must be correct
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationDataIssues?filter[application.id]=${data.dataIssues[0].id}`,
      tests: [
        {
          name: 'filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
        {
          name: 'filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationDataIssues?schema=admin-v2&filter[application.id]=${data.dataIssues[0].id}`,
      tests: [
        {
          name: 'schema=admin-v2&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        // {
        //   name: 'schema=admin-v2&filter[application.id]=${data.dataIssues[0].id}',
        //   userEmail: 'admin@th.test',
        //   expectedStatus: 200,
        //   expectedDataLength: config.local ? 2 : 5,
        // },
        {
          name: 'schema=admin-v2&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'schema=admin-v2&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
      ],
    },
    // {
    //   getUrl: (data) => `application-applicationDataIssues?schema=admin-v2&asUserId=abc`,
    //   tests: [
    //     {
    //       name: 'schema=admin-v2&asUserId=abc',
    //       userEmail: 'signedOut',
    //       expectedStatus: 422, //wrongDataType	abc
    //     },
    //     {
    //       name: 'schema=admin-v2&asUserId=abc',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 422, //wrongDataType	abc
    //     },
    //     {
    //       name: 'schema=admin-v2&asUserId=abc',
    //       userEmail: 'school-1-school@th.test',
    //       expectedStatus: 422, //wrongDataType	abc
    //     },
    //     {
    //       name: 'schema=admin-v2&asUserId=abc',
    //       userEmail: 'endorsed@th.test',
    //       expectedStatus: 422, //wrongDataType	abc
    //     },
    //   ],
    // },
    {
      getUrl: (data) =>
        `application-applicationDataIssues?schema=admin-v2&asUserId=${data.users[0].id}&filter[application.id]=${data.dataIssues[0].id}`,
      tests: [
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        // {
        //   name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=${data.dataIssues[0].id}',
        //   userEmail: 'admin@th.test',
        //   expectedStatus: 200,
        //   expectedDataLength: config.local ? 2 : 5,
        // },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationDataIssues?schema=admin-v2&asUserId=${data.users[1].id}&filter[application.id]=${data.dataIssues[0].id}`,
      tests: [
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[1].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[1].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[1].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[1].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationDataIssues?schema=admin-v2&asUserId=${data.users[2].id}&filter[application.id]=${data.dataIssues[0].id}`,
      tests: [
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[2].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[2].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	user type must be correct
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[2].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[2].id}&filter[application.id]=${data.dataIssues[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationDataIssues?schema=admin-v2&asUserId=${data.users[0].id}&filter[application.id]=a`,
      tests: [
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=a',
          userEmail: 'signedOut',
          expectedStatus: 422, //wrongDataType	a
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=a',
          userEmail: 'admin@th.test',
          expectedStatus: 422, //wrongDataType	a
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=a',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 422, //wrongDataType	a
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=a',
          userEmail: 'endorsed@th.test',
          expectedStatus: 422, //wrongDataType	a
        },
      ],
    },
    {
      getUrl: (data) =>
        `application-applicationDataIssues?schema=admin-v2&asUserId=${data.users[0].id}&filter[application.id]=9999999`,
      tests: [
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=9999999',
          userEmail: 'signedOut',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=9999999',
          userEmail: 'admin@th.test',
          expectedStatus: 404,
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=9999999',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
        {
          name: 'schema=admin-v2&asUserId=${data.asUserId[0].id}&filter[application.id]=9999999',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('applicationDataIssues', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);
      // expect(response.data.data.length).toEqual(t.expectedDataLength);
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
