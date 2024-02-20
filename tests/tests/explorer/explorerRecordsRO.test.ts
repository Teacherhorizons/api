import { ResourceObject, ResourceObjectOrObjects, Response } from 'ts-json-api';

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

// const includeTestNames: string[] = null;
const includeTestNames = ['explorer-records?schema=school - admin'];

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `explorer-records`,
      tests: [
        {
          name: 'explorer-records - signed out',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
        {
          name: 'explorer-records - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
        {
          name: 'explorer-records - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records/foo`,
      tests: [
        {
          name: 'explorer-records/foo - signed out',
          userEmail: 'signedOut',
          expectedStatus: 400, // invalidParameterValue - recordId
        },
        {
          name: 'explorer-records/foo - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - recordId
        },
        {
          name: 'explorer-records/foo',
          userEmail: 'school-1-school@th.test - school',
          expectedStatus: 400, // invalidParameterValue - recordId
        },
        {
          name: 'explorer-records/foo - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // invalidParameterValue - recordId
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=foo`,
      tests: [
        {
          name: 'explorer-records?schema=foo - signed out',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=foo - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'explorer-records?schema=foo - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
        {
          name: 'explorer-records?schema=foo - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=admin&useCache=false`,
      tests: [
        {
          name: 'explorer-records?schema=admin - signed out',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=admin - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records?schema=admin - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=admin - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=school`,
      tests: [
        {
          name: 'explorer-records?schema=school - signed out',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          // NOTE: fails on beta => data issue. bExplorer_activityTypes nameForSchool NULL for activityType 4.
          name: 'explorer-records?schema=school - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records?schema=school - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records?schema=school - endorsed',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?schema=teacher`,
      tests: [
        {
          name: 'explorer-records?schema=teacher - signed out',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=teacher - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
        {
          name: 'explorer-records?schema=teacher - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted - Must be signed in
        },
        {
          name: 'explorer-records?schema=teacher - endorsed',
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
      getUrl: (data) =>
        `explorer-records?schema=admin&filter[teacher.memberNumber][contains]=${data.explorerRecords[0].teacherMemberNumber}`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[teacher.memberNumber][contains]=${data.explorerRecords[0].teacherMemberNumber}',
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
      getUrl: (data) =>
        `explorer-records?schema=admin&filter[latestActivity.type.id][contains]=${data.explorerRecords[2].latestActivityTypeId}`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[latestActivity.type.id][contains]=${data.explorerRecords[2].latestActivityTypeId}',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) =>
        `explorer-records?schema=admin&filter[latestActivity.creationUser.id][contains]=${data.explorerRecords[2].latestActivityCreationUserId}`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[latestActivity.creationUser.id][contains]=${data.explorerRecords[2].latestActivityCreationUserId}',
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
      getUrl: (data) => `explorer-records?schema=admin&page[number]=2`,
      tests: [
        {
          name: 'explorer-records?schema=admin&page[number]=2',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            // NOTE: varies between local and beta. Also changes as more records get added.
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
          getPassesCustomChecks(response, data) {
            return isSortedByCreationDate(response);
          },
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
          getPassesCustomChecks(response, data) {
            const isLatestToEarliest = true;
            return isSortedByCreationDate(response, isLatestToEarliest);
          },
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
          getPassesCustomChecks(response, data) {
            return isSortedByTeacherFullName(response);
          },
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
          getPassesCustomChecks(response, data) {
            const isDescending = true;
            return isSortedByTeacherFullName(response, isDescending);
          },
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
    {
      getUrl: (data) => `explorer-records?schema=admin&filter[activity.date][lte]=2000-08-11T00:00:00Z`,
      tests: [
        {
          name: 'explorer-records?schema=admin&filter[activity.date][lte]=2000-08-11T00:00:00Z - no records',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const schema = (response as any).schema;
            const meta = response.meta;
            const resData = response.data as ResourceObject[];
            return !!schema && !!meta && meta.pageCount === 0 && meta.count === 0 && !!resData && resData.length === 0;
          },
        },
      ],
    },
  ]
);

const isSortedByCreationDate = (response: Response<ResourceObjectOrObjects>, isLatestToEarliest = false) => {
  const data = response.data as ResourceObject[];

  for (let i = 0; i < data.length - 1; i++) {
    if (!data[i].attributes?.creationDate) {
      return false;
    }

    const currentDate = new Date(data[i].attributes.creationDate as Date);
    const nextDate = new Date(data[i + 1].attributes.creationDate as Date);

    if (isLatestToEarliest) {
      if (currentDate < nextDate) {
        return false;
      }
    } else {
      if (currentDate > nextDate) {
        return false;
      }
    }
  }
  return true;
};

const isSortedByTeacherFullName = (response: Response<ResourceObjectOrObjects>, isDescending = false) => {
  const erData = response.data as ResourceObject[];

  const orderedTeacherIds = erData.map((er) => er.relationships.teacher.data).map((f) => (f as any).id);

  const orderedIncludedTeachers = response.included
    .filter((x) => x.type === 'teacher')
    .sort((a, b) => {
      return orderedTeacherIds.indexOf(a.id) - orderedTeacherIds.indexOf(b.id);
    });

  return orderedIncludedTeachers.every((obj, index) => {
    if (index === 0) return true;
    const currentFullName = obj.attributes.fullName;
    const prevFullName = orderedIncludedTeachers[index - 1].attributes.fullName;
    if (isDescending) {
      return currentFullName < prevFullName;
    } else {
      return currentFullName > prevFullName;
    }
  });
};

// testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
testsForGet = testsForGet.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));
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
