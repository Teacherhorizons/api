import * as shared from '../../shared';

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let testIds: number[] = [];

var tests = shared.addTestGroups(
  [],
  [
    // {
    //   getUrl: (data) => `application-applicationEvents?asUserId=${data.users[0].id}`,
    //   getPayload: (data) => ({
    //     //payload 1
    //     data: {
    //       type: 'application-applicationEvent',
    //       attributes: {
    //         application: { id: `${data.applications[0].id}` },
    //         eventType: { id: '14' },
    //         date: '2022-08-15T12:30:00.000Z',
    //         notes: 'FooBasr',
    //         autoEmail: { id: '42' },
    //       },
    //     },
    //   }),
    //   tests: [
    //     {
    //       name: 'admin, as admin',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 201,
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `application-applicationEvents?asUserId=${data.users[1].id}`,
    //   getPayload: (data) => ({
    //     //payload 1
    //     data: {
    //       type: 'application-applicationEvent',
    //       attributes: {
    //         application: { id: `${data.applications[0].id}` },
    //         eventType: { id: '14' },
    //         date: '2022-08-15T12:30:00.000Z',
    //         notes: 'FooBasr',
    //         autoEmail: { id: '42' },
    //       },
    //     },
    //   }),
    //   tests: [
    //     {
    //       name: 'admin, as school, eventTypeId equal 14',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 201,
    //     },
    //     {
    //       name: 'school (school-1), as (any) school',
    //       userEmail: 'school-1-school@th.test',
    //       expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `application-applicationEvents?asUserId=${data.users[1].id}`,
    //   getPayload: (data) => ({
    //     //payload 2
    //     data: {
    //       type: 'application-applicationEvent',
    //       attributes: {
    //         application: { id: `${data.applications[0].id}` },
    //         eventType: { id: '1' },
    //         date: '2022-08-15T12:30:00.000Z',
    //         notes: 'FooBasr',
    //         autoEmail: { id: '42' },
    //       },
    //     },
    //   }),
    //   tests: [
    //     {
    //       name: 'admin, as school, eventTypeId not 14 or 24',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 404, //entityNotFoundForId eventTypeId incorrect for school
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `application-applicationEvents?asUserId=${data.users[4].id}`,
    //   getPayload: (data) => ({
    //     //payload 1
    //     data: {
    //       type: 'application-applicationEvent',
    //       attributes: {
    //         application: { id: `${data.applications[0].id}` },
    //         eventType: { id: '14' },
    //         date: '2022-08-15T12:30:00.000Z',
    //         notes: 'FooBasr',
    //         autoEmail: { id: '42' },
    //       },
    //     },
    //   }),
    //   tests: [
    //     {
    //       name: 'admin, as (any non-admin/school) endorsed',
    //       userEmail: 'admin@th.test',
    //       expectedStatus: 401, //accessNotPermitted	unauthorised
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `application-applicationEvents`,
    //   getPayload: (data) => ({
    //     //payload 1
    //     data: {
    //       type: 'application-applicationEvent',
    //       attributes: {
    //         application: { id: `${data.applications[0].id}` },
    //         eventType: { id: '14' },
    //         date: '2022-08-15T12:30:00.000Z',
    //         notes: 'FooBasr',
    //         autoEmail: { id: '42' },
    //       },
    //     },
    //   }),
    //   tests: [
    //     {
    //       name: 'notSignedIn',
    //       userEmail: 'notSignedIn',
    //       expectedStatus: 401, //accessNotPermitted	Must be signed in
    //     },
    //     {
    //       name: 'school, eventTypeId equal 14',
    //       userEmail: 'school-1-school@th.test',
    //       expectedStatus: 201,
    //     },
    //   ],
    // },
    {
      getUrl: (data) => `application-applicationEvents`,
      getPayload: (data) => ({
        //payload only required attributes
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
    //   {
    //     getUrl: (data) => `application-applicationEvents`,
    //     getPayload: (data) => ({
    //       //payload fails
    //       data: {
    //         type: 'application-applicationEvent',
    //         attributes: {
    //           eventType: { id: '14' },
    //           date: '2022-08-15T12:30:00.000Z',
    //           notes: 'FooBasr',
    //           autoEmail: { id: '42' },
    //         },
    //       },
    //     }),
    //     tests: [
    //       {
    //         name: 'admin, missing applicationId attribute',
    //         userEmail: 'admin@th.test',
    //         expectedStatus: 400,
    //       },
    //     ],
    //   },
    //   {
    //     getUrl: (data) => `application-applicationEvents`,
    //     getPayload: (data) => ({
    //       //payload fails
    //       data: {
    //         type: 'application-applicationEvent',
    //         attributes: {
    //           application: { id: `${data.applications[0].id}` },
    //           date: '2022-08-15T12:30:00.000Z',
    //           notes: 'FooBasr',
    //           autoEmail: { id: '42' },
    //         },
    //       },
    //     }),
    //     tests: [
    //       {
    //         name: 'admin, missing eventTypeId attribute',
    //         userEmail: 'admin@th.test',
    //         expectedStatus: 400,
    //       },
    //     ],
    //   },
    //   {
    //     getUrl: (data) => `application-applicationEvents`,
    //     getPayload: (data) => ({
    //       //payload fails
    //       data: {
    //         type: 'application-applicationEvent',
    //         attributes: {
    //           application: { id: `${data.applications[0].id}` },
    //           eventType: { id: '14' },
    //           notes: 'FooBasr',
    //           autoEmail: { id: '42' },
    //         },
    //       },
    //     }),
    //     tests: [
    //       {
    //         name: 'admin, missing date attribute',
    //         userEmail: 'admin@th.test',
    //         expectedStatus: 400,
    //       },
    //     ],
    //   },
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
