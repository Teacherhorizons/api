import {
  addTestGroups,
  api,
  setupAfterAll,
  setupBeforeAll,
  signIn,
  data,
  compareFnGenerator,
  signedInAs,
  getIsResponseValid,
} from '../../shared';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },

        {
          name: 'explorer-records/${data.explorerRecords[0].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/foo`,
      tests: [
        {
          name: 'explorer-records/foo',
          userEmail: 'signedOut',
          expectedStatus: 400, // invalidParameterValue - recordId
        },
        {
          name: 'explorer-records/foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - recordId
        },

        {
          name: 'explorer-records/foo',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // invalidParameterValue - recordId
        },
        {
          name: 'explorer-records/foo',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // invalidParameterValue - recordId
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=foo`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=foo',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },

        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=foo',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=foo',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=admin&useCache=false`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=school`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=teacher`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=admin&include=activities`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin&include=activities',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=activities`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=activities',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=school&include=activities`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=activities',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=admin&include=teacher`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin&include=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=teacher`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=school&include=teacher`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=teacher',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=admin&include=schoolUser`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin&include=schoolUser',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=schoolUser`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=schoolUser',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=schoolUser',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=school&include=schoolUser`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=schoolUser',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=schoolUser',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=admin&include=schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin&include=schoolUser.schools',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schoolUser
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records/${data.explorerRecords[0].id}?schema=admin&include=schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin&include=schoolUser,schoolUser.schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=schoolUser,schoolUser.schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=schoolUser,schoolUser.schools',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records/${data.explorerRecords[0].id}?schema=school&include=schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=schoolUser,schoolUser.schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=schoolUser,schoolUser.schools',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records/${data.explorerRecords[0].id}?schema=admin&include=teacher,activities,schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin&include=teacher,activities,schoolUser,schoolUser.schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records/${data.explorerRecords[0].id}?schema=school&include=teacher,activities,schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=teacher,activities,schoolUser,schoolUser.schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&include=teacher,activities,schoolUser,schoolUser.schools',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=teacher,activities,schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=teacher,activities,schoolUser,schoolUser.schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&include=teacher,activities,schoolUser,schoolUser.schools',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=admin&useCache=false`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=admin&useCache=false',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=school&useCache=false`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=school&useCache=false',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[0].id}?schema=teacher&useCache=false`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[0].id}?schema=teacher&useCache=false',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[1].id}?schema=admin&include=teacher`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[1].id}?schema=admin&include=teacher - many schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[1].id}?schema=admin&include=activities`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[1].id}?schema=admin&include=activities - many schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/${data.explorerRecords[1].id}?schema=admin&include=schoolUser`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[1].id}?schema=admin&schoolUser - many schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records/${data.explorerRecords[1].id}?schema=admin&include=schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[1].id}?schema=admin&include=schoolUser,schoolUser.schools - many schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records/${data.explorerRecords[1].id}?schema=admin&include=teacher,activities,schoolUser,schoolUser.schools`,
      tests: [
        {
          name: 'explorer-records/${data.explorerRecords[1].id}?schema=admin&include=teacher,activities,schoolUser,schoolUser.schools - many schools',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('explorer-records/{id}', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$name => $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);

      if (t.getPassesCustomChecks) {
        expect(t.getPassesCustomChecks(response.data, data)).toBe(true);
      }

      const isResponseValid = getIsResponseValid(response.data);
      expect(isResponseValid).toBe(true);

      expect(response).toSatisfyApiSpec();
    } else {
      try {
        await api.get(url);
      } catch (error) {
        expect(error.response.status).toEqual(t.expectedStatus);
        expect(error.response).toSatisfyApiSpec();
      }
    }
  });

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await setupAfterAll();
  });
});
