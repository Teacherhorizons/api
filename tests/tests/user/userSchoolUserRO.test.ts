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

const includeTestNames: string[] = null;
// const includeTestNames: string[] = [
//   'user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=photo,explorerSummary,upcomingExplorerInterviews',
// ];

let testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `user-schoolUsers/${data.schoolUsers[0].id}`,
      tests: [
        {
          name: 'user-schoolUsers - no schema',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - schema
        },
      ],
    },
    {
      getUrl: (data) => `user-schoolUsers/foo`,
      tests: [
        {
          name: 'user-schoolUsers/foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - userId
        },
      ],
    },
    {
      getUrl: (data) => `user-schoolUsers/${data.schoolUsers[0].id}?schema=foo`,
      tests: [
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=foo',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidParameterValue - schema
        },
      ],
    },
    {
      getUrl: (data) => `user-schoolUsers/${data.schoolUsers[0].id}?schema=default`,
      tests: [
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=default - admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const responseData = response.data as ResourceObject;
            return responseData.attributes.photo === undefined;
          },
        },
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=default - school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const responseData = response.data as ResourceObject;
            return responseData.attributes.photo === undefined;
          },
        },
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=default - teacher',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=default - signed out',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted
        },
      ],
    },
    {
      getUrl: (data) => `user-schoolUsers/${data.schoolUsers[1].id}?schema=default`,
      tests: [
        {
          name: 'user-schoolUsers/${data.schoolUsers[1].id}?schema=default - unauthorized school',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401,
        },
      ],
    },
    {
      getUrl: (data) => `user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=photo`,
      tests: [
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=photo',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const responseData = response.data as ResourceObject;
            return !!responseData.attributes.photo;
          },
        },
      ],
    },
    {
      getUrl: (data) => `user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=explorerSummary`,
      tests: [
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=explorerSummary',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const responseData = response.data as ResourceObject;
            return responseData.attributes.photo === undefined;
          },
        },
      ],
    },
    {
      getUrl: (data) => `user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=upcomingExplorerInterviews`,
      tests: [
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=upcomingExplorerInterviews',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const responseData = response.data as ResourceObject;
            const upcomingExplorerInterviews = responseData.relationships?.upcomingExplorerInterviews
              .data as ResourceObject[];
            const explorerActivities = upcomingExplorerInterviews.filter((x) => x.type === 'explorer-activity');
            const includedExplorerActivities = response.included.filter((x) => x.type === 'explorer-activity');
            const areAllInFuture = includedExplorerActivities.every(
              (ea) => new Date(ea.attributes.date as string).getTime() > new Date().getTime()
            );
            return (
              responseData.attributes.photo === undefined &&
              explorerActivities.length === includedExplorerActivities.length &&
              areAllInFuture
            );
          },
        },
      ],
    },
    {
      getUrl: (data) =>
        `user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=photo,explorerSummary,upcomingExplorerInterviews`,
      tests: [
        {
          name: 'user-schoolUsers/${data.schoolUsers[0].id}?schema=default&include=photo,explorerSummary,upcomingExplorerInterviews',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          getPassesCustomChecks(response, data) {
            const responseData = response.data as ResourceObject;
            const upcomingExplorerInterviews = responseData.relationships?.upcomingExplorerInterviews
              .data as ResourceObject[];
            const explorerSummary = response.included.filter((x) => x.type === 'explorer-summary')[0];
            const numberOfIncludedUpcomingInterviews =
              explorerSummary.attributes.numberOfExplorerOpenUpcomingInterviews;
            return upcomingExplorerInterviews.length === numberOfIncludedUpcomingInterviews;
          },
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
testsForGet = testsForGet.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));
console.log(101, testsForGet);
jest.setTimeout(60 * 1000);

describe('user-schoolUsers', () => {
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
