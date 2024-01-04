import { AxiosInstance } from 'axios';
// import axios, { AxiosInstance } from 'axios';
// import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';
import shell from 'shelljs';
import { ResourceObject } from 'ts-json-api';

import config from './config';
import { api as api1, signOut as signOut1, signIn as signIn1 } from './api';
import { addTestData, deleteTestData, getAddTestData } from './data/main';

// import specJson from '../tests/specs/openapi.json'; // --resolveJsonModule
const specJson = require('../tests/specs/openapi.json');

// export var api: AxiosInstance;
export var data: Config.Data;

// START MOCK DATA --------------------------
const mockGetData = async (): Promise<Config.Data> => {
  // if (config.createTestData) return;
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // return betaData;
  return config.local ? jpLocalData : betaData;
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

const getResponseDistinctIncludesCount = (included: ResourceObject[]): number => {
  const distinctTypes = new Set<string>();
  for (const resourceObject of included) {
    distinctTypes.add(resourceObject.type);
  }
  return distinctTypes.size;
};

const getSpecIncludedCount = (endpointPath: string): number => {
  const includedCount =
    specJson.paths[endpointPath].get.responses[200].content['application/json'].schema.oneOf[0].properties.included
      .items.anyOf.length;

  return includedCount;
};

// e.g. endpointPath = '/subjects'
export const doesResponseHaveAllIncludes = (included: ResourceObject[], endpointPath: string) => {
  const responseDistinctIncludesCount = getResponseDistinctIncludesCount(included);
  const specIncludesCount = getSpecIncludedCount(endpointPath);
  console.log('responseDistinctIncludesCount: ', responseDistinctIncludesCount);
  console.log('specIncludesCount: ', specIncludesCount);
  return responseDistinctIncludesCount === specIncludesCount;
};

const getSpecBaseRelationshipsCount = (endpointPath: string): number => {
  const baseRelationships =
    specJson.paths[endpointPath].get.responses[200].content['application/json'].schema.oneOf[0].properties.data.items
      .properties.relationships.properties;
  console.log('specBaseRelationships: ', baseRelationships);
  return Object.keys(baseRelationships).length;
};

export const doesResponseHaveAllBaseRelationships = (data: ResourceObject, endpointPath: string) => {
  const responseBaseRelationships = Object.keys(data.relationships);
  console.log('responseBaseRelationships: ', responseBaseRelationships);
  const responseBaseRelationshipsCount = responseBaseRelationships.length;
  const specBaseRelationshipCount = getSpecBaseRelationshipsCount(endpointPath);
  console.log('responseBaseRelationshipsCount: ', responseBaseRelationshipsCount);
  console.log('specIncludesCount: ', specBaseRelationshipCount);
  return responseBaseRelationshipsCount === specBaseRelationshipCount;
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
      else if (!config.createTestData && config.local) data = jpLocalData;
      else if (!config.createTestData && !config.local) data = betaData;
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

const jpLocalData: Config.Data = {
  schools: [
    { id: 3391, slug: 'europe-germany-berlin-my-test-school-101' },
    { id: 3392, slug: 'europe-germany-berlin-my-test-school-102' },
  ],
  teachers: [{ memberNumber: 2223638 }, { memberNumber: 2223639 }, { id: 1031 }],
  jobs: [{ id: 1662 }, { id: 1663 }],
  cities: [{ id: 1, slug: 'africa-angola-luanda' }, { id: 3, slug: 'africa-egypt-alexandria' }, { id: 3000 }],
  countries: [
    { id: 54, slug: 'europe-portugal' },
    { id: 18, slug: 'europe-denmark' },
  ],
  regions: [{ id: 4, slug: 'europe', numberOfArticles: 5, numberOfCountries: 47, numberOfStaff: 7 }],
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
  users: [
    { id: 2, userTypeSlug: 'admin' },
    { id: 1031, userTypeSlug: 'school-1-school' },
    { id: 1070, userTypeSlug: 'school-2-schools' },
    { id: 1064, userTypeSlug: 'teacher-new' },
    { id: 1059, userTypeSlug: 'teacher-endorsed' },
  ],
  dataIssues: [{ id: 1 }],
  explorerRecords: [
    { id: 1 },
    { id: 3 },
    { id: 23, teacherMemberNumber: 1321566, latestActivityTypeId: 7, latestActivityCreationUserId: 1031 },
  ],
  schoolUsers: [{ id: 6 }],
  systemTemplates: [{ id: 1 }],
};

const betaData: Config.Data = {
  schools: [
    { id: 3621, slug: 'europe-germany-berlin-my-test-school-101' },
    { id: 3622, slug: 'europe-germany-berlin-my-test-school-102' },
  ],
  teachers: [{ memberNumber: 2223653 }, { memberNumber: 2223654 }],
  jobs: [{ id: 1832 }, { id: 1833 }],
  cities: [{ id: 1, slug: 'africa-angola-luanda' }, { id: 3, slug: 'africa-egypt-alexandria' }, { id: 3000 }],
  countries: [
    { id: 1, slug: 'europe-albania' },
    { id: 17, slug: 'africa-democratic-republic-of-congo' },
  ],
  regions: [
    { id: 3, slug: 'central-america', numberOfArticles: 3, numberOfCountries: 18, numberOfStaff: 2 },
    { id: 1, slug: 'africa' },
  ],
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
  users: [
    { id: 2, userTypeSlug: 'admin' },
    { id: 1031, userTypeSlug: 'school-1-school' },
    { id: 1070, userTypeSlug: 'school-2-schools' },
    { id: 1064, userTypeSlug: 'teacher-new' },
    { id: 1059, userTypeSlug: 'teacher-endorsed' },
  ],
  explorerRecords: [
    { id: 1 },
    { id: 3 },
    { id: 23, teacherMemberNumber: 1316206, latestActivityTypeId: 2, latestActivityCreationUserId: 14926 },
  ],
  schoolUsers: [{ id: 1031 }],
  systemTemplates: [{ id: 1 }],
};

const getDataItems = (relationships: JsonApi.Relationships): JsonApi.ResourceObject[] => {
  const baseRelationshipDataItems: JsonApi.ResourceObject[] = [];

  for (const relationship of Object.values(relationships)) {
    if (Array.isArray(relationship.data)) {
      const mappedRegions = relationship.data.map((d) => ({
        id: d.id,
        type: d.type,
      }));
      baseRelationshipDataItems.push(...mappedRegions);
    } else {
      baseRelationshipDataItems.push({ id: relationship.data.id, type: relationship.data.type });
    }
  }

  return baseRelationshipDataItems;
};

const isEveryAinB = (a: JsonApi.ResourceObject[], b: JsonApi.ResourceObject[]) => {
  return a.every((aDataItem) =>
    b.some((bDataItem) => bDataItem.id === aDataItem.id && bDataItem.type === aDataItem.type)
  );
};

const getMultipleBaseRelationshipDataItems = (response: JsonApi.Response) => {
  const dataItems: ResourceObject[] = [];

  (response.data as any[]).forEach((item) => {
    for (const relationship in item.relationships) {
      dataItems.push(item.relationships[relationship].data);
    }
  });

  return dataItems;
};

export const getIsResponseValid = (response: JsonApi.Response) => {
  const isSingleWithBaseRelationships =
    !Array.isArray(response.data) && !!(response.data as ResourceObject)?.relationships;

  const isMultiWithBaseRelationships = Array.isArray(response.data) && response.data.some((d) => d?.relationships);

  const hasBaseRelationships = isSingleWithBaseRelationships || isMultiWithBaseRelationships;

  const included = response.included ?? [];

  if (!hasBaseRelationships && included.length === 0) return true;

  const includedRelationships = included
    .filter((item) => item.hasOwnProperty('relationships'))
    .map((item) => item.relationships);

  const baseRelationshipDataItems = Array.isArray(response.data)
    ? getMultipleBaseRelationshipDataItems(response)
    : getDataItems(response.data.relationships);

  let includedRelationshipDataItems: JsonApi.ResourceObject[] = [];

  for (const includedRelationship of includedRelationships) {
    includedRelationshipDataItems.push(...getDataItems(includedRelationship));
  }

  const allRelationships = [...baseRelationshipDataItems, ...includedRelationshipDataItems];

  console.log('allRelationships: ', allRelationships);

  const includedDataItems: JsonApi.ResourceObject[] = included.map((item) => ({
    id: item.id,
    type: item.type,
  }));

  console.log('includedDataItems', includedDataItems);

  // Step 1. Every include has a matching relationship
  const doesEveryIncludeHaveRelationship = isEveryAinB(includedDataItems, allRelationships);
  console.log('doesEveryIncludeHaveRelationship: ', doesEveryIncludeHaveRelationship);

  // Step 2. Every relationship has a matching include
  const doesEveryRelationshipHaveInclude = isEveryAinB(allRelationships, includedDataItems);
  console.log('doesEveryRelationshipHaveInclude', doesEveryRelationshipHaveInclude);

  // Step 3. No duplicated includes
  const hasDuplicateInIncludes = includedDataItems.some(
    (dataItem, index) =>
      includedDataItems.findIndex((item) => item.id === dataItem.id && item.type === dataItem.type) !== index
  );
  console.log('hasDuplicateInIncludes: ', hasDuplicateInIncludes);

  // Step 4. Number of includes <= Number of relationship
  const isIncludesLessThanOrEqualRelationships = includedDataItems.length <= allRelationships.length;
  console.log('isIncludesLessThanOrEqualRelationships: ', isIncludesLessThanOrEqualRelationships);

  return (
    doesEveryIncludeHaveRelationship &&
    doesEveryRelationshipHaveInclude &&
    !hasDuplicateInIncludes &&
    isIncludesLessThanOrEqualRelationships
  );
};

export const isArrayOfLength1 = (x: unknown) => isArrayOfLengthN(x);

export const isArrayOfLengthN = (x: unknown, lengthN: number = 1): boolean => {
  if (!Array.isArray(x)) return false;
  if (x.length !== lengthN) return false;
  return true;
};

export const numberOfIncludedMatches = (response: JsonApi.Response, entityType: string, number: number): boolean => {
  if (response.included.filter((x: JsonApi.ResourceObject) => x.type === entityType).length !== number) return false;
  return true;
};
