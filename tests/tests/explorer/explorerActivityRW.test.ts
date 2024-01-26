import { deleteTestData, postAddedTestData } from '../../data/main';
import * as shared from '../../shared';

const includeTestNames: string[] = null;

let explorerActivityIds: number[] = [];

let tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `explorer-activities`,
      getPayload: (data) => getExplorerActivityPayload(),
      tests: [
        {
          name: 'explorer-activities',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 201,
        },
        {
          name: 'explorer-records',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-records',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-records',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-activities?asUserId=${data.users[1].id}`,
      getPayload: (data) => getExplorerActivityPayload(),
      tests: [
        {
          name: 'explorer-activities?asUserId=${data.users[1].id}',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-activities?asUserId=${data.users[1].id}',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-activities?asUserId=${data.users[1].id}',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-activities?asUserId=${data.users[1].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
        },
      ],
    },
    {
      getUrl: (data) => `explorer-activities?asUserId=${data.teachers[3].id}`,
      getPayload: (data) => getExplorerActivityPayload(),
      tests: [
        {
          name: 'explorer-activities?asUserId=${data.teachers[3].id}',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
        },
      ],
    },
  ]
);

const getExplorerActivityPayload = () => {
  return {
    data: {
      type: 'explorer-activity',
      attributes: {
        date: '2011-02-07T15:53:34Z',
        text: 'Accepted another offer',
        record: {
          id: '24',
        },
        type: {
          id: '1',
        },
      },
    },
  };
};

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('explorerActivityRW', () => {
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
          explorerActivityIds.push(response.data.data.id);
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
    console.log(explorerActivityIds);
    let isSuccess = false;
    if (explorerActivityIds.length > 0) {
      try {
        const testId = await postAddedTestData(explorerActivityIds, 'explorerActivityIds');
        console.log('Created testId: ', testId);
        const wasTestDataDeleted = await deleteTestData(testId);
        console.log('wasTestDataDeleted: ', wasTestDataDeleted);
        isSuccess = true;
      } catch (error) {
        console.log(error);
      }
    }
    await shared.setupAfterAll();
    return isSuccess;
  });
});
