export function adminNoSchema(urlParam: string, filtersParam: string, statusParam: number, dataLengthParam: number) {
  return {
    getUrl: (data) => urlParam + filtersParam,
    tests: [
      {
        name: 'BASE: admin, no schema',
        userEmail: 'admin@th.test',
        expectedStatus: 400, //missingMandatoryParameter schema must be passed
      },
    ],
  };
}

export function signedOutAdminSchema(
  urlParam: string,
  filtersParam: string,
  statusParam: number,
  dataLengthParam: number
) {
  return {
    getUrl: (data) => urlParam + `?schema=admin` + filtersParam,
    tests: [
      {
        name: 'BASE: signedOut, with admin schema',
        userEmail: 'signedOut',
        expectedStatus: statusParam, //accessNotPermitted	Must be signed in
      },
    ],
  };
}

export function adminAdminSchemaAdminUser(
  urlParam: string,
  filtersParam: string,
  statusParam: number,
  dataLengthParam: number,
  schema = 'admin'
) {
  return {
    getUrl: (data) => urlParam + `?schema=${schema}&asUserId=${data.users[0].id}` + filtersParam,
    tests: [
      {
        name: 'BASE: admin, with admin schema, as admin user',
        userEmail: 'admin@th.test',
        expectedStatus: statusParam,
        expectedDataLength: dataLengthParam,
      },
    ],
  };
}

export function adminAdminSchemaSchoolUser(
  urlParam: string,
  filtersParam: string,
  statusParam: number,
  dataLengthParam: number
) {
  return {
    getUrl: (data) => urlParam + `?schema=admin&asUserId=${data.users[1].id}` + filtersParam,
    tests: [
      {
        name: 'BASE: admin, with admin schema, as school user',
        userEmail: 'admin@th.test',
        expectedStatus: statusParam, //missingMandatoryParameter schema invalid, must be school
      },
    ],
  };
}

export function adminSchoolSchemaSchoolUser(
  urlParam: string,
  filtersParam: string,
  statusParam: number,
  dataLengthParam: number
) {
  return {
    getUrl: (data) => urlParam + `?schema=school&asUserId=${data.users[1].id}` + filtersParam,
    tests: [
      {
        name: 'BASE: admin, with school schema, as school user',
        userEmail: 'admin@th.test',
        expectedStatus: statusParam,
        expectedDataLength: dataLengthParam,
      },
    ],
  };
}

export function adminTeacherSchemaTeacherUser(
  urlParam: string,
  filtersParam: string,
  statusParam: number,
  dataLengthParam: number
) {
  return {
    getUrl: (data) => urlParam + `?schema=teacher&asUserId=${data.users[2].id}` + filtersParam,
    tests: [
      {
        name: 'BASE: admin, with teacher schema, as teacher user',
        userEmail: 'admin@th.test',
        expectedStatus: statusParam,
        expectedDataLength: dataLengthParam,
      },
    ],
  };
}

export function schoolSchoolSchema(
  urlParam: string,
  filtersParam: string,
  statusParam: number,
  dataLengthParam: number
) {
  return {
    getUrl: (data) => urlParam + `?schema=school` + filtersParam,
    tests: [
      {
        name: 'BASE: school, with school schema',
        userEmail: 'school-1-school@th.test',
        expectedStatus: statusParam,
        expectedDataLength: dataLengthParam,
      },
    ],
  };
}

export function techerTeacherSchema(
  urlParam: string,
  filtersParam: string,
  statusParam: number,
  dataLengthParam: number
) {
  return {
    getUrl: (data) => urlParam + `?schema=teacher` + filtersParam,
    tests: [
      {
        name: 'BASE: teacher, with teacher schema',
        userEmail: 'endorsed@th.test',
        expectedStatus: statusParam,
        expectedDataLength: dataLengthParam,
      },
    ],
  };
}

export function techerTeacherSchemaTeacherUser(
  urlParam: string,
  filtersParam: string,
  statusParam: number,
  dataLengthParam: number
) {
  return {
    getUrl: (data) => urlParam + `?schema=teacher&asUserId=${data.users[2].id}` + filtersParam,
    tests: [
      {
        name: 'BASE: teacher (any non-admin), with teacher schema, as teacher User',
        userEmail: 'endorsed@th.test',
        expectedStatus: statusParam, //accessNotPermitted	User not permitted to use asUserId
      },
    ],
  };
}
