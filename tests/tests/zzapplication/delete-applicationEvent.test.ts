import * as shared from '../../shared';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let testIds: number[] = [];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      tests: [
        {
          name: 'admin,',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      tests: [
        {
          name: 'admin,',
          userEmail: 'admin@th.test',
          expectedStatus: 404, //entityNotFoundForId	Application event not found
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[1]}?asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          name: 'admin, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[2]}?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'admin, (any non-admin) school',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	unauthorised
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[2]}?asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: '(any non-admin) school (school-1), (any) school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[2]}`,
      tests: [
        {
          name: '(any non-admin) school,',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	unauthorised
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('delete-applicationEvent', () => {
  beforeAll(async () => {
    await shared.setupBeforeAll();
    if (tests.length > 0) {
      try {
        await shared.signIn('admin@th.test');
        let payload = {
          //payload 1
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
        let testStatus;
        for (let i = 0; i < tests.length; i++) {
          testStatus = tests[i].expectedStatus;
          if (testStatus == 204) {
            let response = await shared.api.post('application-applicationEvents', payload);
            if (response.data.data.id != null) {
              testIds.push(response.data.data.id);
              console.log(`postTestMadeDataSuccess - ${testIds}`, response.data);
            }
          }
        }
        return true;
      } catch (error) {
        console.log('postTestMadeData', error);
        return false;
      }
    }
  });

  describe('DELETE', () => {
    test.each(tests)('$name => $expectedStatus', async (t: Test.Test) => {
      if (shared.signedInAs != t.userEmail) await shared.signIn(t.userEmail);
      const url = t.getUrl(shared.data);

      if (t.expectedStatus === 204) {
        const response = await shared.api.delete(url);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response).toSatisfyApiSpec();
      } else {
        try {
          await shared.api.delete(url);
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
    await shared.setupAfterAll();
  });
});
