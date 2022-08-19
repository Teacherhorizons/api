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

import config from '../../config';

var testsForGet = addTestGroups(
  [],
  [
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=admin&asUserId=${data.asUserId[4].id}`,
      tests: [
        {
          name: 'admin, as non-admin (endorsed)',
          userEmail: 'admin@th.test',
          expectedStatus: 400, //missingMandatoryParameter schema invalid, must be teacher
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=admin&asUserId=${data.asUserId[0].id}`,
      tests: [
        {
          name: 'admin, as admin',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=school&asUserId=${data.asUserId[1].id}`,
      tests: [
        {
          name: 'admin, schema=school, as school (school-1-school)',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[3].id}?schema=teacher&asUserId=${data.asUserId[4].id}`,
      tests: [
        {
          name: 'admin, schema=teacher, as teacher (endorsed)',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[3].id}?schema=teacher`,
      tests: [
        {
          name: 'teacher (endorsed)',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
        },
        {
          name: 'teacher (endorsed), has all attributes',
          userEmail: 'endorsed@th.test',
          expectedStatus: 200,
          count: 300,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=school`,
      tests: [
        {
          name: 'school (school-1-school)',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
        },
        {
          name: 'school (school-1-school), has all attributes',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 200,
          count: 200,
        },
      ],
    },
    {
      getUrl: (data) => `applications/${data.applications[0].id}?schema=admin`,
      tests: [
        {
          name: 'admin, has all attributes',
          userEmail: 'admin@th.test',
          expectedStatus: 200,
          count: 100,
        },
      ],
    },
  ]
);

testsForGet = testsForGet.sort(compareFnGenerator(['userEmail']));
jest.setTimeout(60 * 1000);

describe('applications/{id}', () => {
  beforeAll(async () => {
    await setupBeforeAll();
  });

  test.each(testsForGet)('$name => $expectedStatus', async (t: Test.Test) => {
    if (signedInAs != t.userEmail) await signIn(t.userEmail);
    const url = t.getUrl(data);

    if (t.expectedStatus === 200) {
      const response = await api.get(url);
      expect(response.status).toEqual(t.expectedStatus);
      expect(response.data.data.length).toEqual(t.expectedDataLength);
      expect(response).toSatisfyApiSpec();
      if (t.count === 100) {
        // admin
        // data.data.attributes
        expect(response.data.data.attributes.recommendationText).toEqual('testingText');
        expect(response.data.data.attributes.thSystemMatchScore).toEqual(0.71);
        expect(response.data.data.attributes.thMatchType).toEqual({ id: '1' });
        // data.data.relationships
        expect(response.data.data.relationships.latestEvent).toEqual({
          data: { id: '131482', type: 'application-applicationEvent' },
        });
        // data.included
        //data.included.school
        expect(response.data.included[0].attributes.lraUser).toEqual({ id: '2' });
        //data.included.job
        expect(response.data.included[1].attributes.thOwnerUser).toEqual({ id: '3' });
      }
      if (t.count === 200) {
        // school
        // data.included
        // //data.included.school
        expect(response.data.included[0].relationships.lraUser).toEqual({ data: { id: '2', type: 'user' } });
        // //data.included.job
        expect(response.data.included[1].relationships.school).toEqual({ data: { id: '3391', type: 'school' } });
        expect(response.data.included[1].relationships.thOwnerUser).toEqual({ data: { id: '3', type: 'user' } });
      }
      if (t.count === 300) {
        // teacher
        // data.included
        // //data.included.school
        expect(response.data.included[0].attributes.leadRecruitmentContactName).toEqual('Barty Berty');
        expect(response.data.included[0].attributes.leadRecruitmentContactEmail).toEqual('barty@aa.bb.cc');
        expect(response.data.included[0].relationships.lraUser).toEqual({ data: { id: '2', type: 'user' } });
        // //data.included.job
        expect(response.data.included[1].relationships.thOwnerUser).toEqual({ data: { id: '3', type: 'user' } });
      }
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
