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

let testApplicationEventIds: number[] = [];

var testsForPost = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents?asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          name: 'admin, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
          payloadId: 1,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'admin, as school, eventTypeId equal 14',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
          payloadId: 1,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'admin, as school, eventTypeId not 14 or 24',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId eventTypeId incorrect for school
          payloadId: 2,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?asUserId=${data.asUserId[4].id}`,
      tests: [
        {
          name: 'admin, (any non-admin/school) endorsed',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	unauthorised
          payloadId: 1,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'school (school-1), (any non-admin) school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
          payloadId: 1,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents`,
      tests: [
        {
          name: 'school, eventTypeId equal 14',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 201,
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
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[0]}`,
      tests: [
        {
          name: 'admin,',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
          payloadId: 201,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[0]}?asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          name: 'admin, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
          payloadId: 201,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[0]}?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'admin, (any non-admin) school',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	unauthorised
          payloadId: 201,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[0]}?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'school (school-1), (any non-admin) school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
          payloadId: 201,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[0]}`,
      tests: [
        {
          name: 'school, (any non-admin)',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401,
          payloadId: 201,
        },
      ],
    },
  ]
);

var testsForDelete = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[0]}`,
      tests: [
        {
          name: 'admin,',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[0]}`,
      tests: [
        {
          name: 'admin,',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId	Application event not found
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[1]}?asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          name: 'admin, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[2]}?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'admin, (any non-admin) school',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	unauthorised
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[2]}?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: '(any non-admin) school (school-1), (any) school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[2]}`,
      tests: [
        {
          name: '(any non-admin) school,',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401,
        },
      ],
    },
  ]
);

var testsForCleanUp = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents/${testApplicationEventIds[2]}`,
      tests: [
        {
          name: 'admin, cleaning up (remove extra event)',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
      ],
    },
  ]
);

testsForPost = testsForPost.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

testsForPatch = testsForPatch.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

testsForDelete = testsForDelete.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

testsForCleanUp = testsForCleanUp.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('application-applicationEvents', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  function getPayloadById(
    payloadId: number
  ): JsonApi.HttpPayload<Partial<JsonApi.Application_applicationEvent>> | object {
    if (payloadId === 1) {
      return {
        data: {
          type: 'application-applicationEvent',
          attributes: {
            application: { id: `${data.applications[0].id}` },
            eventType: { id: '14' },
            date: '2022-08-15T12:30:00.000Z',
            notes: 'FooBasr',
            autoEmail: { id: '42' },
          },
        },
      };
    } else if (payloadId === 2) {
      return {
        data: {
          type: 'application-applicationEvent',
          attributes: {
            application: { id: `${data.applications[0].id}` },
            eventType: { id: '1' },
            date: '2022-08-15T12:30:00.000Z',
            notes: 'FooBasr',
            autoEmail: { id: '42' },
          },
        },
      };
    } else if (payloadId === 201) {
      return {
        data: {
          type: 'application-applicationEvent',
          id: `${testApplicationEventIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
            notes: 'Foosssssss',
          },
        },
      };
    } else if (payloadId === 202) {
      return {
        data: {
          type: 'application-applicationEvent',
          id: `${testApplicationEventIds[0]}`,
          attributes: {
            eventType: { id: '11' },
            date: '2022-04-30T15:53:38.702Z',
            notes: 'Foosssssss',
          },
        },
      };
    } else {
      return {};
    }
  }

  describe('POST', () => {
    test.each(testsForPost)('$name => $expectedStatus', async (t: Test.Test) => {
      if (signedInAs != t.userEmail) await signIn(t.userEmail);
      let payload = getPayloadById(t.payloadId);
      const url = t.getUrl(data);

      if (t.expectedStatus === 201) {
        const response = await api.post(url, payload);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
        if (response.data.data.id != null) {
          testApplicationEventIds.push(response.data.data.id);
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
    test.each(testsForPatch)('$name => $expectedStatus', async (t: Test.Test) => {
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
          console.log('successful by accident');
        } catch (error) {
          expect(error.response.status).toEqual(t.expectedStatus);
          expect(error.response).toSatisfyApiSpec();
        }
      }
    });
  });

  describe('DELETE', () => {
    test.each(testsForDelete)('$name => $expectedStatus', async (t: Test.Test) => {
      if (signedInAs != t.userEmail) await signIn(t.userEmail);
      const url = t.getUrl(data);

      if (t.expectedStatus === 204) {
        const response = await api.delete(url);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
      } else {
        try {
          await api.delete(url);
          console.log('successful by accident');
        } catch (error) {
          expect(error.response.status).toEqual(t.expectedStatus);
          expect(error.response).toSatisfyApiSpec();
        }
      }
    });
  });

  describe('CLEAN UP', () => {
    test.each(testsForCleanUp)('$name => $expectedStatus', async (t: Test.Test) => {
      if (signedInAs != t.userEmail) await signIn(t.userEmail);
      const url = t.getUrl(data);

      if (t.expectedStatus === 204) {
        const response = await api.delete(url);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
      } else {
        try {
          await api.delete(url);
          console.log('successful by accident');
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
