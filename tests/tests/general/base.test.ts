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
      getUrl: (data) => `applications/${data.applications[0].id}`,
      tests: [
        {
          name: 'notSignedIn',
          userEmail: 'notSignedIn',
          expectedStatus: 401, //accessNotPermitted	Must be signed in
        },
        {
          name: 'any (admin), no schema',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema must be passed
        },
      ],
    },
    {
      getUrl: (data) => `applications/999999?schema=admin`,
      tests: [
        {
          name: 'any (admin), invalid integer id',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId	ApplicationId not found
        },
        {
          name: 'teacher (endorsed), schema<>teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be teacher
        },
        {
          name: 'school (school-1-school), schema<>school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, //missingMandatoryParameter	schema invalid, must be school
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=school`,
      tests: [
        {
          name: 'school (school-2-schools), different school',
          userEmail: 'school-2-schools@th.test',
          expectedStatus: 401, //accessNotPermitted	User does not have access to related school
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=teacher`,
      tests: [
        {
          name: 'teacher (endorsed), different teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User does not have access to related teacher
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=admin&asUserId=abc`,
      tests: [
        {
          name: 'admin, non-integer asUserId',
          userEmail: 'admin@th.test',
          expectedStatus: 422, //wrongDataType	abc
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=admin&asUserId=999999`,
      tests: [
        {
          name: 'admin, invalid integer asUserId',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId	User not found
        },
        {
          name: 'not admin (endorsed), asUserId',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('base tests', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$name => $expectedStatus', async (t: Test.Test) => {
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

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await setupAfterAll();
  });
});
