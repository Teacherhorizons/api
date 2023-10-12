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

let testApplicationIds: number[] = [];

var testsForPost = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications`,
      tests: [
        {
          // POST an application using jobId & teacherMemberNumber | works for admin
          name: 'admin POST 1',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
          payloadId: 1,
        },
        {
          name: 'signedOut POST 1',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted | Must be signed in,
          payloadId: 1,
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
  ]
);

var testsForPatch = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/${testApplicationIds[0]}`,
      tests: [
        {
          name: 'admin PATCH 101, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
          payloadId: 101,
        },
        {
          name: 'signedOut PATCH 101',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted | Must be signed in,
          payloadId: 101,
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
    }
    return {};
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
