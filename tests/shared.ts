import { AxiosInstance } from 'axios';
// import axios, { AxiosInstance } from 'axios';
// import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';
import shell from 'shelljs';

import config from './config';
import { api as api1, signOut as signOut1, signIn as signIn1 } from './api';
import { addTestData, deleteTestData } from './data/main';

// export var api: AxiosInstance;
export var data: Config.Data;

const mockGetData = async (): Promise<Config.Data> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const data: Config.Data = {
    schools: [],
    teachers: [],
    jobs: [],
    applications: [{ id: 30 }, { id: 31 }],
  };
  return data;
};

export const setupBeforeAll = async () => {
  try {
    console.log('setupBeforeAll');
    if (data) return;
    // if (config.createTestData) data = await addTestData();
    data = await mockGetData();
    console.log(202, data);

    shell.exec('npm run build-yaml');
    jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
  } catch (error) {
    console.log('setup - beforeAll:', error);
  }
};

export function setup(context = {}) {
  jest.setTimeout(90 * 1000);
  beforeAll(async () => {
    try {
      if (config.createTestData) data = await addTestData();
      // shell.exec('npm run build-yaml');
      // jestOpenAPI(path.join(process.cwd(), 'tests/specs/openapi.yaml'));
    } catch (error) {
      console.log('setup - beforeAll:', error);
    }
  });

  afterAll(async () => {
    jest.setTimeout(30 * 1000);
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

export const signIn = async (userName?: string) => {
  await signIn1(userName);
  api = api1;
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
    tests.push({ getUrl: testGroup.getUrl, ...testGroupTest });
  });
  return tests;
};

export const addTestGroups = (tests: Test.Test[], testGroups: Test.TestGroup[]) => {
  testGroups.forEach((testGroup) => (tests = addTestGroup(tests, testGroup)));
  return tests;
};
