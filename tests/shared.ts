import { AxiosInstance } from 'axios';
// import axios, { AxiosInstance } from 'axios';
// import cookie from 'cookie';
import jestOpenAPI from 'jest-openapi';
import path from 'path';
import shell from 'shelljs';
import fs from 'fs';
import yaml from 'js-yaml';
import { ResourceObject } from 'ts-json-api';

import config from './config';
import { api as api1, signOut as signOut1, signIn as signIn1 } from './api';
import { addTestData, deleteTestData, getAddTestData } from './data/main';

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

const getResponseDistinctIncludes = (included: ResourceObject[]): Set<string> => {
  const distinctTypes = new Set<string>();
  for (const resourceObject of included) {
    distinctTypes.add(resourceObject.type);
  }
  return distinctTypes;
};

const getJsonFromYaml = (category: string, fileNameWithoutExtension: string): Record<string, any> => {
  const filePath = `openapi/components/responses/${category}/${fileNameWithoutExtension}.yaml`;
  const yamlFilePath = path.join(process.cwd(), filePath);
  const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
  const json: Record<string, any> = yaml.load(yamlContent);
  return json;
};

const getSpecIncludes = (
  category: string,
  fileNameWithoutExtension: string,
  specResponseName: string,
  schema = 'notSignedIn'
) => {
  // e.g. 1 - Response_regional-countries_notSignedIn
  // e.g. 2 - Response_subject_notSignedIn
  const responseName = specResponseName || `Response_${category}-${fileNameWithoutExtension}_${schema}`;
  const json = getJsonFromYaml(category, fileNameWithoutExtension);

  if (!json.hasOwnProperty(responseName)) return -1;

  return json[responseName].properties.included.items.anyOf;
};

export const doesResponseHaveAllSpecIncludes = (
  included: ResourceObject[],
  category: string,
  fileNameWithoutExtension: string,
  specResponseName = '',
  schema = 'notSignedIn'
): boolean => {
  const responseDistinctIncludes = getResponseDistinctIncludes(included);
  const specIncludes = getSpecIncludes(category, fileNameWithoutExtension, specResponseName, schema);

  const responseDistinctIncludesCount = responseDistinctIncludes.size;
  const specIncludesCount = specIncludes?.length || -1;

  console.log('responseDistinctIncludesCount: ', responseDistinctIncludesCount);
  console.log('specIncludesCount: ', specIncludesCount);

  if (responseDistinctIncludesCount !== specIncludesCount) {
    console.log('responseDistinctIncludes: ', responseDistinctIncludes);
    console.log('specIncludes: ', specIncludes);
    return false;
  }

  return true;
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
  teachers: [{ memberNumber: 2223638 }, { memberNumber: 2223639 }],
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

export const getIsResponseValid = (response: JsonApi.Response) => {
  const data = Array.isArray(response.data) ? response.data[0] : response.data;
  const baseRelationships = data.relationships;

  if (!baseRelationships && response.included.length === 0) return true;

  const includedRelationships = response.included
    .filter((item) => item.hasOwnProperty('relationships'))
    .map((item) => item.relationships);

  const baseRelationshipDataItems = getDataItems(baseRelationships);

  let includedRelationshipDataItems: JsonApi.ResourceObject[] = [];

  for (const includedRelationship of includedRelationships) {
    includedRelationshipDataItems.push(...getDataItems(includedRelationship));
  }

  const allRelationships = [...baseRelationshipDataItems, ...includedRelationshipDataItems];

  console.log('allRelationships: ', allRelationships);

  const includedDataItems: JsonApi.ResourceObject[] = response.included.map((item) => ({
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
