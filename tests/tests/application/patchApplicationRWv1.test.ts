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
      ],
    },
  ]
);

testsForPatch = testsForPatch.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('applicationsRW', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  function getPayloadById(payloadId: number): JsonApi.HttpPayload<Partial<JsonApi.Application>> | object {
    if (payloadId === 101)
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
    return {};
  }

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
