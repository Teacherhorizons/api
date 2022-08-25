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

type PostResponse = JsonApi.HttpResponse<JsonApi.ApplicationResponse>;

// TODO: consider making 'addTestGroups' more of a 'test builder' function (e.g. merge payload data in at this point)
// TODO: consider being able to modify the test data here to be able to run only 1 or a few tests
var testsForPost = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications`,
      tests: [
        // POST TESTS
        {
          name: 'signedOut POST 1',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted | Must be signed in,
          count: 1,
        },
        {
          // POST an application using jobId & teacherMemberNumber | works for admin
          name: 'admin POST 1',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
          count: 1,
        },
        {
          name: 'admin POST 2',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput (string too long)
          count: 2,
        },
        {
          name: 'admin POST 3',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId | jobId not found
          count: 3,
        },
        {
          name: 'admin POST 4',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId | memberNumber not found
          count: 4,
        },
        {
          name: 'admin POST 5',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter | memberNumber must be passed
          count: 5,
        },
        {
          name: 'admin POST 6',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter | job must be passed
          count: 6,
        },
        {
          name: 'admin POST 7',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | Unrecognized field
          count: 7,
        },
        {
          name: 'admin POST 8',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | type needs to be 'application'
          count: 8,
        },
        {
          name: 'school1 POST 1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted | unauthorised
          count: 1,
        },
        {
          name: 'teacher POST 1',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted | unauthorised
          count: 1,
        },
      ],
    },
  ]
);

var testsForPatch = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/${data.applications[0].id}`,
      tests: [
        // POST TESTS
        {
          name: 'signedOut PATCH 101',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted | Must be signed in,
          count: 101,
        },
        {
          // PATCH an application using jobId & teacherMemberNumber | works for admin
          name: 'admin PATCH 101',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
          count: 101,
        },
        {
          name: 'admin PATCH 102',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput (applicationId string too long)
          count: 102,
        },
        {
          name: 'admin PATCH 103',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId | applicationId not found
          count: 103,
        },
        {
          name: 'admin PATCH 104',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter | applicationId not found
          count: 104,
        },
        {
          name: 'admin PATCH 105',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter | type not found
          count: 105,
        },
        {
          name: 'admin PATCH 106',
          userEmail: 'admin@th.test',
          expectedStatus: 204, //currently no mandatory parameters | sets recommendationText to NULL
          count: 106,
        },
        {
          name: 'admin PATCH 107',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | Unrecognized field
          count: 107,
        },
        {
          name: 'admin PATCH 108',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | type needs to be 'application'
          count: 108,
        },
        {
          name: 'admin PATCH 109',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | Unrecognized field
          count: 109,
        },
        {
          name: 'school1 PATCH 101',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted | unauthorised
          count: 101,
        },
        {
          name: 'teacher PATCH 101',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted | unauthorised
          count: 101,
        },
      ],
    },
  ]
);

testsForPost = testsForPost.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

testsForPatch = testsForPatch.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('applicationsRW', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  describe('POST', () => {
    test.each(testsForPost)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
      if (signedInAs != t.userEmail) await signIn(t.userEmail);
      let payload = {};
      if (t.count === 1) {
        payload = {
          data: {
            type: 'application',
            attributes: { job: { id: `${data.jobs[0].id}` }, memberNumber: `${data.teachers[0].memberNumber}` },
          },
        };
      } else if (t.count === 2) {
        payload = {
          data: {
            type: 'application',
            attributes: { job: { id: `9999999999` }, memberNumber: `${data.teachers[0].memberNumber}` },
          },
        };
      } else if (t.count === 3) {
        payload = {
          data: {
            type: 'application',
            attributes: { job: { id: `99999999` }, memberNumber: `${data.teachers[0].memberNumber}` },
          },
        };
      } else if (t.count === 4) {
        payload = {
          data: {
            type: 'application',
            attributes: { job: { id: `${data.jobs[0].id}` }, memberNumber: `99999999` },
          },
        };
      } else if (t.count === 5) {
        payload = {
          data: {
            type: 'application',
            attributes: { job: { id: `${data.jobs[0].id}` } },
          },
        };
      } else if (t.count === 6) {
        payload = {
          data: {
            type: 'application',
            attributes: { memberNumber: `${data.teachers[0].memberNumber}` },
          },
        };
      } else if (t.count === 7) {
        payload = {
          data: {
            type: 'application',
            attributes: {
              job: { id: `${data.jobs[0].id}` },
              recommendationText: `testing1231231`,
              memberNumber: `${data.teachers[0].memberNumber}`,
            },
          },
        };
      } else if (t.count === 8) {
        payload = {
          data: {
            type: 'application2',
            attributes: {
              job: { id: `${data.jobs[0].id}` },
              memberNumber: `${data.teachers[0].memberNumber}`,
            },
          },
        };
      } else {
        payload = {};
      }
      const url = t.getUrl(data);

      if (t.expectedStatus === 201) {
        const response = await api.post(url, payload);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
      } else {
        try {
          await api.post(url, payload);
          console.log('successful by accident');
        } catch (error) {
          expect(error.response.status).toEqual(t.expectedStatus);
          expect(error.response).toSatisfyApiSpec();
        }
      }
    });
  });

  function getPayloadById(payloadId: number): JsonApi.HttpPayload<Partial<JsonApi.Application>> | object {
    if (payloadId === 101) {
      return {
        data: {
          type: 'application',
          id: `${data.applications[0].id}`,
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo101',
          },
        },
      };
    } else if (payloadId === 102) {
      return {
        data: {
          type: 'application',
          id: '9999999999',
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo102',
          },
        },
      };
    } else if (payloadId === 103) {
      return {
        data: {
          type: 'application',
          id: '9999999',
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo103',
          },
        },
      };
    } else if (payloadId === 104) {
      return {
        data: {
          type: 'application',
          // id: `${data.applications[0].id}`,
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo104',
          },
        },
      };
    } else if (payloadId === 105) {
      return {
        data: {
          // type: 'application',
          id: `${data.applications[0].id}`,
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo105',
          },
        },
      };
    } else if (payloadId === 106) {
      return {
        data: {
          type: 'application',
          id: `${data.applications[0].id}`,
          attributes: {},
        },
      };
    } else if (payloadId === 107) {
      return {
        data: {
          type: 'application',
          id: `${data.applications[0].id}`,
          attributes: {
            invalidAttributeName: { id: null },
            recommendationText: 'foo107',
          },
        },
      };
    } else if (payloadId === 108) {
      return {
        data: {
          type: 'application2',
          id: `${data.applications[0].id}`,
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo108',
          },
        },
      };
    } else if (payloadId === 109) {
      return {
        data: {
          type: 'application',
          id: `${data.applications[0].id}`,
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo109',
            creationUserId: 1,
          },
        },
      };
    } else {
      return {};
    }
  }

  describe('PATCH', () => {
    test.each(testsForPatch)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
      if (signedInAs != t.userEmail) await signIn(t.userEmail);
      let payload = getPayloadById(t.count);
      const url = t.getUrl(data);

      if (t.expectedStatus === 204) {
        const response = await api.patch(url, payload);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
      } else {
        try {
          await api.patch(url, payload);
        } catch (error) {
          expect(error.response.status).toEqual(t.expectedStatus);
          expect(error.response).toSatisfyApiSpec();
        }
      }
    });
  });

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await setupAfterAll();
  });
});
