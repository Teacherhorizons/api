import { ResourceObject } from 'ts-json-api';

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
      getUrl: (data) => `explorer-records`,
      tests: [
        {
          name: 'explorer-records',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
        {
          name: 'explorer-records',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
        {
          name: 'explorer-records',
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
      getUrl: (data) => `explorer-records?schema=foo`,
      tests: [
        {
          name: 'explorer-records?schema=foo',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'explorer-records?schema=foo',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'explorer-records?schema=foo',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&useCache=false`,
      tests: [
        {
          name: 'explorer-records?schema=admin',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records?schema=admin',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=admin',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=school`,
      tests: [
        {
          name: 'explorer-records?schema=school',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=school',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records?schema=school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records?schema=school',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=teacher`,
      tests: [
        {
          name: 'explorer-records?schema=teacher',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=teacher',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records?schema=teacher',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[teacher.fullName][matches]=poo`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[teacher.fullName][matches]=poo',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[teacher.memberNumber][contains]=1321566`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[teacher.memberNumber][contains]=1321566',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[status.id][contains]=1,2`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[status.id][contains]=1,2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[latestActivity.type.id][contains]=7`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[latestActivity.type.id][contains]=7',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[latestActivity.creationUser.id][contains]=1031`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[latestActivity.creationUser.id][contains]=1031',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[latestActivity.creationDate][gte]=2022-08-11T00:00:00Z`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[latestActivity.creationDate][gte]=2022-08-11T00:00:00Z',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[latestActivity.date][lte]=2024-08-11T00:00:00Z`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[latestActivity.date][lte]=2024-08-11T00:00:00Z',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[activity.type.id][contains]=1`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[activity.type.id][contains]=1',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[activity.type.id][doesNotContain]=11`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[activity.type.id][doesNotContain]=11',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[activity.date][gte]=2022-12-09T00:00:00Z`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[activity.date][gte]=2022-12-09T00:00:00Z',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[activity.date][lte]=2024-10-18T00:00:00Z`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[activity.date][lte]=2024-10-18T00:00:00Z',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[activity.type.id][containsInPast]=1,2`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[activity.type.id][containsInPast]=1,2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[activity.type.id][doesNotContainInPast]=1,2`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[activity.type.id][doesNotContainInPast]=1,2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[school.name][matches]=al`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[school.name][matches]=al',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[school.city.id][contains]=447`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[school.city.id][contains]=447',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[school.city.country.id][contains]=100`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[school.city.country.id][contains]=100',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[school.city.country.region.id][contains]=7`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[school.city.country.region.id][contains]=7',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&page[size]=2`,
      tests: [
        {
          name: 'explorer-records?schema=admin&page[size]=2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length == 2 && response.meta.pageCount == 2;
          },
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&page[number]=20`,
      tests: [
        {
          name: 'explorer-records?schema=admin&page[number]=20',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            return (response.data as ResourceObject[]).length == 4 && response.meta.pageCount == 4;
          },
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&sort=creationDate`,
      tests: [
        {
          name: 'explorer-records?schema=admin&sort=creationDate',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&sort=-creationDate`,
      tests: [
        {
          name: 'explorer-records?schema=admin&sort=-creationDate',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&sort=teacherFullName`,
      tests: [
        {
          name: 'explorer-records?schema=admin&sort=teacherFullName',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&sort=-teacherFullName`,
      tests: [
        {
          name: 'explorer-records?schema=admin&sort=-teacherFullName',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&sort=latestActivityDate`,
      tests: [
        {
          name: 'explorer-records?schema=admin&sort=latestActivityDate',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&sort=-latestActivityDate`,
      tests: [
        {
          name: 'explorer-records?schema=admin&sort=-latestActivityDate',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records?schema=admin&page[size]=10&page[number]=2&sort=teacherFullName&filter[status.id][contains]=1,2`,
      tests: [
        {
          name: 'explorer-records?schema=admin - multiple filters',
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

describe('explorer-records', () => {
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
