import * as shared from '../../shared';

const includeTestNames: string[] = null;

let testIds: number[] = [];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
            notes: 'notes1',
          },
        },
      }),
      tests: [
        {
          name: 'admin, all attributes (eventTypeId, date, notes)',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
        {
          name: 'notSignedIn',
          userEmail: 'notSignedIn',
          expectedStatus: 401, // accessNotPermitted	Must be signed in
        },
        {
          name: 'teacher PATCH 101',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted | unauthorised
        },
        {
          name: 'school, eventTypeId equal 14',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted | unauthorised
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('patch-applicationEvent', () => {
  beforeAll(async () => {
    await shared.setupBeforeAll();
    if (tests.length > 0) {
      try {
        await shared.signIn('admin@th.test');
        let payload = {
          data: {
            type: 'application-applicationEvent',
            attributes: {
              application: { id: `${shared.data.applications[0].id}` },
              eventType: { id: '14' },
              date: '2022-08-15T12:30:00.000Z',
              notes: 'FooBasr',
              autoEmail: { id: '42' },
            },
          },
        };
        let response = await shared.api.post('application-applicationEvents', payload);
        if (response.data.data.id != null) {
          testIds.push(response.data.data.id);
          console.log(`postTestMadeDataSuccess - ${testIds}`, response.data);
        }
        return true;
      } catch (error) {
        console.log('postTestMadeData', error);
        return false;
      }
    }
  });

  describe('PATCH', () => {
    test.each(tests)('$name => $expectedStatus', async (t: Test.Test) => {
      if (shared.signedInAs != t.userEmail) await shared.signIn(t.userEmail);
      const url = t.getUrl(shared.data);
      const payload = t.getPayload(shared.data);

      if (t.expectedStatus === 204) {
        const response = await shared.api.patch(url, payload);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
      } else {
        try {
          await shared.api.patch(url, payload);
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
