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

let testApplicationIds: number[] = [];

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
          payloadId: 1,
        },
        {
          // POST an application using jobId & teacherMemberNumber | works for admin
          name: 'admin POST 1',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
          payloadId: 1,
        },
        {
          name: 'admin POST 2',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput (string too long)
          payloadId: 2,
        },
        {
          name: 'admin POST 3',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId | jobId not found
          payloadId: 3,
        },
        {
          name: 'admin POST 4',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId | memberNumber not found
          payloadId: 4,
        },
        {
          name: 'admin POST 5',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter | memberNumber must be passed
          payloadId: 5,
        },
        {
          name: 'admin POST 6',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter | job must be passed
          payloadId: 6,
        },
        {
          name: 'admin POST 7',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | Unrecognized field
          payloadId: 7,
        },
        {
          name: 'admin POST 8',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | type needs to be 'application'
          payloadId: 8,
        },
        {
          name: 'school1 POST 1',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted | unauthorised
          payloadId: 1,
        },
        {
          name: 'teacher POST 1',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted | unauthorised
          payloadId: 1,
        },
      ],
    },
    {
      getUrl: (data) => `applications?asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          // POST an application using jobId & teacherMemberNumber | works for admin
          name: 'admin POST 1, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
          payloadId: 1,
        },
      ],
    },
    {
      getUrl: (data) => `applications?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'admin POST 1, as school',
          userEmail: 'admin@th.test',
          expectedStatus: 401, // accessNotPermitted	unauthorised
          payloadId: 1,
        },
      ],
    },
    {
      getUrl: (data) => `applications?asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          name: 'school1 POST 1, as admin',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
          payloadId: 1,
        },
      ],
    },
  ]
);

var testsForPatch = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/${testApplicationIds[0]}`,
      tests: [
        // PATCH TESTS
        {
          name: 'signedOut PATCH 101',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted | Must be signed in,
          payloadId: 101,
        },
        {
          // PATCH an application using jobId & teacherMemberNumber | works for admin
          name: 'admin PATCH 101',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
          payloadId: 101,
        },
        {
          name: 'admin PATCH 102',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput (applicationId string too long)
          payloadId: 102,
        },
        {
          name: 'admin PATCH 103',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId | applicationId not found
          payloadId: 103,
        },
        {
          name: 'admin PATCH 104',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter | applicationId not found
          payloadId: 104,
        },
        {
          name: 'admin PATCH 105',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter | type not found
          payloadId: 105,
        },
        {
          name: 'admin PATCH 106',
          userEmail: 'admin@th.test',
          expectedStatus: 204, //currently no mandatory parameters | sets recommendationText to NULL
          payloadId: 106,
        },
        {
          name: 'admin PATCH 107',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | Unrecognized field
          payloadId: 107,
        },
        {
          name: 'admin PATCH 108',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | type needs to be 'application'
          payloadId: 108,
        },
        {
          name: 'admin PATCH 109',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput | Unrecognized field
          payloadId: 109,
        },
        {
          name: 'school1 PATCH 101',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted | unauthorised
          payloadId: 101,
        },
        {
          name: 'teacher PATCH 101',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, //accessNotPermitted | unauthorised
          payloadId: 101,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${testApplicationIds[0]}?asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          // PATCH an application using jobId & teacherMemberNumber | works for admin
          name: 'admin PATCH 101, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
          payloadId: 101,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${testApplicationIds[0]}?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'admin PATCH 101, as school1',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	unauthorised
          payloadId: 101,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${testApplicationIds[0]}?asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          name: 'school1 PATCH 101, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
          payloadId: 101,
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

  function getPayloadById(payloadId: number): JsonApi.HttpPayload<Partial<JsonApi.Application>> | object {
    if (payloadId === 1) {
      return {
        data: {
          type: 'application',
          attributes: { job: { id: `${data.jobs[0].id}` }, memberNumber: `${data.teachers[0].memberNumber}` },
        },
      };
    } else if (payloadId === 2) {
      return {
        data: {
          type: 'application',
          attributes: { job: { id: `9999999999` }, memberNumber: `${data.teachers[0].memberNumber}` },
        },
      };
    } else if (payloadId === 3) {
      return {
        data: {
          type: 'application',
          attributes: { job: { id: `99999999` }, memberNumber: `${data.teachers[0].memberNumber}` },
        },
      };
    } else if (payloadId === 4) {
      return {
        data: {
          type: 'application',
          attributes: { job: { id: `${data.jobs[0].id}` }, memberNumber: `99999999` },
        },
      };
    } else if (payloadId === 5) {
      return {
        data: {
          type: 'application',
          attributes: { job: { id: `${data.jobs[0].id}` } },
        },
      };
    } else if (payloadId === 6) {
      return {
        data: {
          type: 'application',
          attributes: { memberNumber: `${data.teachers[0].memberNumber}` },
        },
      };
    } else if (payloadId === 7) {
      return {
        data: {
          type: 'application',
          attributes: {
            job: { id: `${data.jobs[0].id}` },
            recommendationText: `testing1231231`,
            memberNumber: `${data.teachers[0].memberNumber}`,
          },
        },
      };
    } else if (payloadId === 8) {
      return {
        data: {
          type: 'application2',
          attributes: {
            job: { id: `${data.jobs[0].id}` },
            memberNumber: `${data.teachers[0].memberNumber}`,
          },
        },
      };
    } else if (payloadId === 101) {
      return {
        data: {
          type: 'application',
          id: `${testApplicationIds[0]}`,
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
          id: `${testApplicationIds[0]}`,
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
          id: `${testApplicationIds[0]}`,
          attributes: {},
        },
      };
    } else if (payloadId === 107) {
      return {
        data: {
          type: 'application',
          id: `${testApplicationIds[0]}`,
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
          id: `${testApplicationIds[0]}`,
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
          id: `${testApplicationIds[0]}`,
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
  describe('POST', () => {
    test.each(testsForPost)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
      if (signedInAs != t.userEmail) await signIn(t.userEmail);
      let payload = getPayloadById(t.payloadId);
      const url = t.getUrl(data);

      if (t.expectedStatus === 201) {
        const response = await api.post(url, payload);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
        if (response.data.data.id != null) {
          testApplicationIds.push(response.data.data.id);
        }
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

  describe('PATCH', () => {
    test.each(testsForPatch)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
      if (signedInAs != t.userEmail) await signIn(t.userEmail);
      let payload = getPayloadById(t.payloadId);
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
