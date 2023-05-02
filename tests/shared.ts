import { AxiosInstance } from 'axios';
// import axios, { AxiosInstance } from 'axios';
// import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';
import shell from 'shelljs';

import config from './config';
import { api as api1, signOut as signOut1, signIn as signIn1 } from './api';
import { addTestData, deleteTestData, getAddTestData } from './data/main';

// export var api: AxiosInstance;
export var data: Config.Data;

// START MOCK DATA --------------------------
const mockGetData = async (): Promise<Config.Data> => {
  // if (config.createTestData) return;
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return config.local ? meLocalData : betaData;
};

export const setupBeforeAll = async () => {
  try {
    console.log('setupBeforeAll');
    if (data) return;
    // if (config.createTestData) data = await getAddTestData();
    // else data = await mockGetData();
    data = config.createTestData ? await getAddTestData() : await mockGetData();
    console.log(202, data);

    shell.exec('npm run build-yaml');
    jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
  } catch (error) {
    console.log('setup - beforeAll:', error);
  }
};

export const setupAfterAll = async () => {
  jest.setTimeout(60 * 1000);
  try {
    if (config.createTestData) await deleteTestData(data.test.id);
  } catch (error) {
    console.log('afterAll', error);
  }
};

// START AGAIN ------------------------
export function setup(context = {}) {
  jest.setTimeout(90 * 1000);
  beforeAll(async () => {
    try {
      if (config.createTestData) data = await addTestData();
      else if (!config.createTestData && config.local)
        data = {
          schools: [
            { id: 3391, slug: 'europe-germany-berlin-my-test-school-101' },
            { id: 3392, slug: 'europe-germany-berlin-my-test-school-102' },
          ],
          teachers: [{ memberNumber: 2223638 }, { memberNumber: 2223639 }],
          jobs: [{ id: 1662 }, { id: 1663 }],
          applications: [{ id: 62103 }, { id: 62104 }, { id: 62105 }, { id: 62106 }, { id: 62107 }],
          applicationEvents: [
            { id: 131487 },
            { id: 131488 },
            { id: 131489 },
            { id: 131490 },
            { id: 131491 },
            { id: 131492 },
            { id: 131493 },
            { id: 131494 },
          ],
          test: { id: 109 },
        };
      else if (!config.createTestData && !config.local)
        data = {
          schools: [
            { id: 3621, slug: 'europe-germany-berlin-my-test-school-101' },
            { id: 3622, slug: 'europe-germany-berlin-my-test-school-102' },
          ],
          teachers: [{ memberNumber: 2223653 }, { memberNumber: 2223654 }],
          jobs: [{ id: 1832 }, { id: 1833 }],
          applications: [{ id: 135338 }, { id: 135339 }, { id: 135340 }, { id: 135341 }, { id: 135342 }],
          applicationEvents: [
            { id: 2407997 },
            { id: 2407998 },
            { id: 2407999 },
            { id: 2408000 },
            { id: 2408001 },
            { id: 2408002 },
            { id: 2408003 },
            { id: 2408004 },
          ],
          test: { id: 109 },
        };
      console.log('data: ', data);
      // start ---
      shell.exec('npm run build-yaml');
      jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
    } catch (error) {
      console.log('setup - beforeAll:', error);
    }
  });

  afterAll(async () => {
    jest.setTimeout(60 * 1000);
    try {
      // if (config.createTestData) await deleteTestData(45);
      if (config.createTestData) await deleteTestData(data.test.id);
    } catch (error) {
      console.log('afterAll', error);
    }
  });

  return context;
}

// TODO: refactor
export var api: AxiosInstance;
export var signedInAs: string;

export const signIn = async (userName?: string) => {
  console.info('Sign in as', userName);
  await signIn1(userName);
  api = api1;
  signedInAs = userName;
};

export const signOut = async () => {
  await signOut1();
};

export const setApi = signIn;

// export const signIn = async (userName?: string) => {
//   // sign in as userName and set the api global variable
//   const axiosData = 'email=' + userName + '&password=password&keepMeSignedIn=0';
//   const axiosConfig = {
//     baseURL: config.baseURL,
//     auth: config.auth,
//     headers: {
//       Cookie: '',
//     },
//   };
//   if (userName) {
//     const signInResponse = await axios.post('auth/sign-in', axiosData, axiosConfig);
//     const JSESSIONID = cookie.parse(signInResponse.headers['set-cookie'][0]).JSESSIONID;
//     axiosConfig.headers.Cookie = 'JSESSIONID=' + JSESSIONID;
//   }
//   api = axios.create(axiosConfig);
//   // console.log('sign in successful');
// };

// export const setApi = signIn;

// export const signOut = async () => {
//   await api.post('user/sign-out');
//   // console.log('sign out successful');
// };
// TODO: move elsewhere
export function compareFnGenerator<T extends object>(
  keys: (keyof T | Sort.SortConfig<T>)[]
): (a: T, b: T) => 0 | 1 | -1 {
  // use to generate a compare function for sorting
  // based on: https://stackoverflow.com/a/56192318 (improved)
  // e.g. foos.sort(compareFnGenerator<Bar.Foo>(['baz', { key: 'qux', reverse: true }]));
  // e.g. foos.sort(compareFnGenerator<Bar.Foo>([{ key: 'quux', map: (x: number) => (x === -1)]));
  return function (a: T, b: T) {
    const firstKey: keyof T | Sort.SortConfig<T> = keys[0];
    const isSimple = typeof firstKey === 'string';
    const key: keyof T = isSimple ? (firstKey as keyof T) : (firstKey as Sort.SortConfig<T>).key;
    const reverse: boolean = isSimple ? false : !!(firstKey as Sort.SortConfig<T>).reverse;
    const map: Sort.ItemMap | null = isSimple ? null : (firstKey as Sort.SortConfig<T>).map || null;

    const valA = map ? map(a[key]) : a[key];
    const valB = map ? map(b[key]) : b[key];

    if (valA > valB) return reverse ? -1 : 1;
    if (valA < valB) return reverse ? 1 : -1;
    if (keys.length === 1) return 0;
    return compareFnGenerator(keys.slice(1))(a, b);
  };
}

export const addTestGroup = (tests: Test.Test[], testGroup: Test.TestGroup) => {
  testGroup.tests.forEach((testGroupTest) => {
    tests.push({ getUrl: testGroup.getUrl, getPayload: testGroup.getPayload, ...testGroupTest });
  });
  return tests;
};

export const addTestGroups = (tests: Test.Test[], testGroups: Test.TestGroup[]) => {
  testGroups.forEach((testGroup) => (tests = addTestGroup(tests, testGroup)));
  return tests;
};

const meLocalData: Config.Data = {
  schools: [
    { id: 3391, slug: 'europe-germany-berlin-my-test-school-101' },
    { id: 3392, slug: 'europe-germany-berlin-my-test-school-102' },
  ],
  teachers: [{ memberNumber: 2223638 }, { memberNumber: 2223639 }],
  jobs: [{ id: 1662 }, { id: 1663 }],
  applications: [{ id: 62103 }, { id: 62104 }, { id: 62105 }, { id: 62106 }, { id: 62107 }],
  applicationEvents: [
    { id: 131487 },
    { id: 131488 },
    { id: 131489 },
    { id: 131490 },
    { id: 131491 },
    { id: 131492 },
    { id: 131493 },
    { id: 131494 },
  ],
  dataIssues: [{ id: 10, expectedDataLength: 2 }],
  users: [
    { id: 2, userTypeSlug: 'admin' },
    { id: 1031, userTypeSlug: 'school-1-school' },
    { id: 1070, userTypeSlug: 'school-2-schools' },
    { id: 1064, userTypeSlug: 'teacher-new' },
    { id: 1059, userTypeSlug: 'teacher-endorsed' },
  ],
  // asUserId: [{ id: 2 }, { id: 1031 }, { id: 23638 }, { id: 1070 }, { id: 1059 }],
  test: { id: 109 },
};

const betaData: Config.Data = {
  schools: [
    { id: 3640, slug: 'europe-germany-berlin-my-test-school-101' },
    { id: 3641, slug: 'europe-germany-berlin-my-test-school-102' },
  ],
  teachers: [{ memberNumber: 2223666 }, { memberNumber: 2223667 }],
  jobs: [{ id: 1852 }, { id: 1853 }],
  applications: [{ id: 135370 }, { id: 135371 }, { id: 135372 }, { id: 135373 }, { id: 135374 }],
  applicationEvents: [
    { id: 2408108 },
    { id: 2408109 },
    { id: 2408110 },
    { id: 2408111 },
    { id: 2408112 },
    { id: 2408113 },
    { id: 2408114 },
    { id: 2408115 },
  ],
  dataIssues: [{ id: 34, expectedDataLength: 5 }],
  users: [
    { id: 2, userTypeSlug: 'admin' },
    { id: 1031, userTypeSlug: 'school-1-school' },
    { id: 1070, userTypeSlug: 'school-2-schools' },
    { id: 1064, userTypeSlug: 'teacher-new' },
    { id: 1059, userTypeSlug: 'teacher-endorsed' },
  ],
  test: { id: 116 },
};
