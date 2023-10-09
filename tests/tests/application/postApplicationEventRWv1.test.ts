import * as shared from '../../shared';

const includeTestNames: string[] = null;

let testIds: number[] = [];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents`,
      getPayload: (data) => ({
        data: {
          type: 'application-applicationEvent',
          attributes: {
            application: { id: `${data.applications[0].id}` },
            eventType: { id: '14' },
            date: '2022-08-15T12:30:00.000Z',
          },
        },
      }),
      tests: [
        {
          name: 'admin, only required attributes',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('post-applicationEvent', () => {
  beforeAll(async () => {
    await shared.setupBeforeAll();
  });

  describe('POST', () => {
    test.each(tests)('$name => $expectedStatus', async (t: Test.Test) => {
      if (shared.signedInAs != t.userEmail) await shared.signIn(t.userEmail);
      const url = t.getUrl(shared.data);
      const payload = t.getPayload(shared.data);

      if (t.expectedStatus === 201) {
        const response = await shared.api.post(url, payload);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
        if (response.data.data.id != null) {
          testIds.push(response.data.data.id);
        }
      } else {
        try {
          await shared.api.post(url, payload);
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
    console.log(testIds);
    let isSuccess = false;
    if (testIds.length > 0) {
      try {
        await shared.signIn('admin@th.test');
        let testId;
        for (let i = 0; i < testIds.length; i++) {
          testId = testIds[i];
          const response = await shared.api.delete('application-applicationEvents/' + testId);
          console.log(`deleteTestMadeDataSuccess - ${testIds[i]}`, response.data);
        }
        isSuccess = true;
      } catch (error) {
        console.log('deleteTestMadeData', error);
      }
    }

    await shared.setupAfterAll();

    return isSuccess;
  });
});
