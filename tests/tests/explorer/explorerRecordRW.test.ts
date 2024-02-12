import { deleteTestData, postAddedTestData } from '../../data/main';
import * as shared from '../../shared';

const includeTestNames: string[] = null;
// const includeTestNames: string[] = ['explorer-records?asUserId=${data.users[1].id} - teacher id && memberNumber'];

let explorerRecordIds: number[] = [];

const hasTeacherId = true;
const hasTeacherMemberNumber = true;

let tests = shared.addTestGroups(
  [],
  [
    {
      getUrl: (data) => `explorer-records`,
      getPayload: (data) => getExplorerRecordPayload(hasTeacherId, !hasTeacherMemberNumber),
      tests: [
        {
          name: 'explorer-records - teacherId',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 201,
        },
        {
          name: 'explorer-records - teacherId',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-records - teacherId',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-records - teacherId',
          userEmail: 'admin@th.test',
          expectedStatus: 404, // schoolUserId not found
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?asUserId=${data.users[1].id}`,
      getPayload: (data) => getExplorerRecordPayload(!hasTeacherId, hasTeacherMemberNumber),
      tests: [
        {
          name: 'explorer-records?asUserId=${data.users[1].id} - teacher memberNumber',
          userEmail: 'admin@th.test',
          expectedStatus: 201,
        },
        {
          name: 'explorer-records?asUserId=${data.users[1].id} - teacher memberNumber',
          userEmail: 'school-1-school@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-records?asUserId=${data.users[1].id} - teacher memberNumber',
          userEmail: 'signedOut',
          expectedStatus: 401, // accessNotPermitted
        },
        {
          name: 'explorer-records?asUserId=${data.users[1].id} - teacher memberNumber',
          userEmail: 'endorsed@th.test',
          expectedStatus: 401, // accessNotPermitted
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?asUserId=${data.users[1].id}`,
      getPayload: (data) => getExplorerRecordPayload(hasTeacherId, hasTeacherMemberNumber),
      tests: [
        {
          name: 'explorer-records?asUserId=${data.users[1].id} - teacher id && memberNumber',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // invalidJSONInput - Only one of teacherId or memberNumber, not both
        },
      ],
    },
    {
      getUrl: (data) => `explorer-records?asUserId=${data.users[1].id}`,
      getPayload: (data) => getExplorerRecordPayload(!hasTeacherId, !hasTeacherMemberNumber),
      tests: [
        {
          name: 'explorer-records?asUserId=${data.users[1].id} - no teacher id or memberNumber',
          userEmail: 'admin@th.test',
          expectedStatus: 400, // missingMandatoryParameter - teacherId or memberNumber required
        },
      ],
    },
  ]
);

const getExplorerRecordPayload = (hasTeacherId: boolean, hasMemberNumber: boolean) => {
  const payload = {
    data: {
      type: 'explorer-record',
      attributes: {
        text: 'foo bar baz',
        teacher: {} as { id?: string; memberNumber?: string },
      },
    },
  };

  if (hasTeacherId) {
    payload.data.attributes.teacher.id = '2513';
  }

  if (hasMemberNumber) {
    payload.data.attributes.teacher.memberNumber = '123724';
  }

  return payload;
};

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
