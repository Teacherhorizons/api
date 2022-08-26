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

const includeTestNames: string[] = null;
// const includeTestNames = ['signedOut PATCH 101'];

var testsForPatch = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/${data.applications[0].id}`,
      getPayload: (data) => ({
        data: {
          type: 'application',
          id: `${data.applications[0].id}`,
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo101',
          },
        },
      }),
      tests: [
        {
          name: 'signedOut PATCH 101',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted | Must be signed in,
        },
        {
          // PATCH an application using jobId & teacherMemberNumber | works for admin
          name: 'admin PATCH 101',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}`,
      getPayload: (data) => ({
        data: {
          type: 'application',
          id: '9999999999',
          attributes: {
            thMatchType: { id: null },
            recommendationText: 'foo102',
          },
        },
      }),
      tests: [
        {
          name: 'admin PATCH 102',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput (applicationId string too long)
        },
      ],
    },
  ]
);

testsForPatch = testsForPatch.sort(compareFnGenerator(['userEmail']));
testsForPatch = testsForPatch.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('applicationsRW', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  describe('PATCH', () => {
    test.each(testsForPatch)('$userEmail, $name, $expectedStatus', async (t: Test.Test) => {
      if (signedInAs != t.userEmail) await signIn(t.userEmail);
      const url = t.getUrl(data);
      const payload = t.getPayload(data);

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
