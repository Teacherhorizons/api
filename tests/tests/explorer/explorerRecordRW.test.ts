import { deleteTestData, postAddedTestData } from '../../data/main';
import * as shared from '../../shared';

const includeTestNames: string[] = null;

let explorerRecordIds: number[] = [];

var tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `explorer-records`,
      getPayload: (data) => ({
        data: {
          type: 'explorer-record',
          attributes: {
            text: 'foo bar baz',
            teacher: {
              id: '2513',
              memberNumber: '123724',
            },
          },
        },
      }),
      tests: [
        {
          name: 'explorer-record',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 201,
        },
      ],
    },
  ]
);

tests = tests.sort(shared.compareFnGenerator(['userEmail']));
tests = tests.filter((t) => includeTestNames == null || includeTestNames.includes(t.name));

describe('explorerRecordRW', () => {
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
          explorerRecordIds.push(response.data.data.id);
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
    console.log(explorerRecordIds);
    let isSuccess = false;
    if (explorerRecordIds.length > 0) {
      try {
        const testId = await postAddedTestData(explorerRecordIds, 'explorerRecordIds');
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
