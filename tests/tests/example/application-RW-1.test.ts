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

var testsForPatch = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/${data.applications[0].id}`,
      tests: [
        // PATCH TESTS
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
      ],
    },
  ]
);

testsForPatch = testsForPatch.sort(compareFnGenerator(['userEmail']));

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
  } else {
    return {};
  }
}

describe('applicationsRW', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

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

  afterAll(async () => {
    await setupAfterAll();
  });
});
