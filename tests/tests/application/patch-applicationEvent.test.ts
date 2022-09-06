import * as shared from '../../shared';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let testIds: number[] = [];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        //payload 1
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
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            autoEmail: { id: '42' },
            date: '2022-04-30T15:53:38.702Z',
            notes: 'notes2',
          },
        },
      }),
      tests: [
        {
          name: 'admin, additional attribute (autoEmailId)',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput unrecognised field
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
          },
        },
      }),
      tests: [
        {
          name: 'admin, required attributes (eventTypeId & date)',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
          },
        },
      }),
      tests: [
        {
          name: `admin, missing 'id'`,
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput null
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            date: '2022-04-30T15:53:38.702Z',
          },
        },
      }),
      tests: [
        {
          name: `admin, missing 'eventTypeId' attribute`,
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter eventType must be passed
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            // date: '2022-04-30T15:53:38.702Z',
          },
        },
      }),
      tests: [
        {
          name: `admin, missing 'date' attribute`,
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter date must be passed
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
          },
        },
      }),
      tests: [
        {
          name: `admin, missing 'type'`,
          userEmail: 'admin@th.test',
          expectedStatus: 400, //invalidJSONInput type needs to be 'application-applicationEvent'
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}?asUserId=${data.asUserId[0].id}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
            notes: 'notes3',
          },
        },
      }),
      tests: [
        {
          name: 'admin, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 204,
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}?asUserId=${data.asUserId[1].id}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
            notes: 'notes4',
          },
        },
      }),
      tests: [
        {
          name: 'admin, as (any non-admin) school',
          userEmail: 'admin@th.test',
          expectedStatus: 401, //accessNotPermitted	unauthorised
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}?asUserId=${data.asUserId[1].id}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
            notes: 'notes5',
          },
        },
      }),
      tests: [
        {
          name: 'school (school-1), as (any non-admin) school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
        },
      ],
    },
    {
      getUrl: (data) => `application-applicationEvents/${testIds[0]}`,
      getPayload: (data) => ({
        //payload 1
        data: {
          type: 'application-applicationEvent',
          id: `${testIds[0]}`,
          attributes: {
            eventType: { id: '14' },
            date: '2022-04-30T15:53:38.702Z',
            notes: 'notes6',
          },
        },
      }),
      tests: [
        {
          name: 'school (any non-admin),',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401,
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
    if (testIds.length > 0) {
      try {
        await shared.signIn('admin@th.test');
        let testId;
        for (let i = 0; i < testIds.length; i++) {
          testId = testIds[i];
          const response = await shared.api.delete('application-applicationEvents/' + testId);
          console.log(`deleteTestMadeDataSuccess - ${testIds[i]}`, response.data);
        }
        return true;
      } catch (error) {
        console.log('deleteTestMadeData', error);
        return false;
      }
    }
    await shared.setupAfterAll();
  });
});
