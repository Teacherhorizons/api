import * as shared from "../../shared";
import * as base from "../../baseTests";

const includeTestNames: string[] = null;
// const includeTestNames = ['admin, as admin'];

let baseUrl = `regional-countries`;

var tests = shared.addTestGroups(
  [],
  [
    // {
    //   getUrl: (data) => `regional-countries`,
    //   tests: [
    //     {
    //       name: "regional-countries",
    //       userEmail: "signedOut",
    //       expectedStatus: 400, //missingMandatoryParameter	schema must be passed
    //     },
    //     {
    //       name: "regional-countries",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter	schema must be passed
    //     },
    //     {
    //       name: "regional-countries",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter	schema must be passed
    //     },
    //     {
    //       name: "regional-countries",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter	schema must be passed
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `regional-countries?schema=abc`,
    //   tests: [
    //     {
    //       name: "schema=abc",
    //       userEmail: "signedOut",
    //       expectedStatus: 400, //missingMandatoryParameter	schema must be correct
    //     },
    //     {
    //       name: "schema=abc",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter	schema must be correct
    //     },
    //     {
    //       name: "schema=abc",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter	schema must be correct
    //     },
    //     {
    //       name: "schema=abc",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter	schema must be correct
    //     },
    //   ],
    // },
    // // not-signed-in-multiple -------------------------------------------------
    // {
    //   getUrl: (data) =>
    //     `regional-countries?schema=not-signed-in-multiple&include=jobs`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in-multiple&include=jobs",
    //       userEmail: "signedOut",
    //       expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&include=jobs",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&include=jobs",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&include=jobs",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 422, //nonExistentParameterPassed	include must not be passed
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `regional-countries?schema=not-signed-in-multiple&filter[slug]=europe-portugal`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in-multiple&filter[slug]=europe-portugal",
    //       userEmail: "signedOut",
    //       expectedStatus: 422, //nonExistentParameterPassed filter[slug] must not be passed
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[slug]=europe-portugal",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 422, //nonExistentParameterPassed filter[slug] must not be passed
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[slug]=europe-portugal",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 422, //nonExistentParameterPassed filter[slug] must not be passed
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[slug]=europe-portugal",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 422, //nonExistentParameterPassed filter[slug] must not be passed
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) => `regional-countries?schema=not-signed-in-multiple`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in-multiple",
    //       userEmail: "signedOut",
    //       expectedStatus: 200,
    //       expectedDataLength: 187,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 187,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 187,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 187,
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `regional-countries?schema=not-signed-in-multiple&filter[region.id]=2`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.id]=2",
    //       userEmail: "signedOut",
    //       expectedStatus: 200,
    //       expectedDataLength: 30,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.id]=2",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 30,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.id]=2",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 30,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.id]=2",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 30,
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `regional-countries?schema=not-signed-in-multiple&filter[region.slug]=europe`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.slug]=europe",
    //       userEmail: "signedOut",
    //       expectedStatus: 200,
    //       expectedDataLength: 46,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.slug]=europe",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 46,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.slug]=europe",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 46,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.slug]=europe",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 46,
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `regional-countries?schema=not-signed-in-multiple&filter[region.id]=99`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.id]=99",
    //       userEmail: "signedOut",
    //       expectedStatus: 404, //entityNotFoundForId regionId not found
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `regional-countries?schema=not-signed-in-multiple&filter[region.slug]=europeabc`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in-multiple&filter[region.slug]=europeabc",
    //       userEmail: "signedOut",
    //       expectedStatus: 400, //missingMandatoryParameter filter[region.slug] must be correct
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `regional-countries?schema=not-signed-in-multiple&asUserId=${data.asUserId[0].id}`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in-multiple&asUserId=${data.asUserId[0].id}",
    //       userEmail: "signedOut",
    //       expectedStatus: 401, //accessNotPermitted	Must be signed in
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&asUserId=${data.asUserId[0].id}",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 187,
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&asUserId=${data.asUserId[0].id}",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
    //     },
    //     {
    //       name: "schema=not-signed-in-multiple&asUserId=${data.asUserId[0].id}",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 401, //accessNotPermitted	User not permitted to use asUserId
    //     },
    //   ],
    // },
    // // not-signed-in- -----------------------------------------------------------
    // {
    //   getUrl: (data) => `regional-countries?schema=not-signed-in`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in",
    //       userEmail: "signedOut",
    //       expectedStatus: 404, //missingMandatoryParameter
    //       // countryId value or filter[slug] must be passed
    //     },
    //     {
    //       name: "schema=not-signed-in",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter
    //       // countryId value or filter[slug] must be passed
    //     },
    //     {
    //       name: "schema=not-signed-in",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter
    //       // countryId value or filter[slug] must be passed
    //     },
    //     {
    //       name: "schema=not-signed-in",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter
    //       // countryId value or filter[slug] must be passed
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `regional-countries?schema=not-signed-in&filter[slug]=europe-portugalabc`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugalabc",
    //       userEmail: "signedOut",
    //       expectedStatus: 404, //entityNotFoundForSlug filter[slug] must be correct
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugalabc",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 404, //entityNotFoundForSlug filter[slug] must be correct
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugalabc",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 404, //entityNotFoundForSlug filter[slug] must be correct
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugalabc",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 404, //entityNotFoundForSlug filter[slug] must be correct
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal",
    //       userEmail: "signedOut",
    //       expectedStatus: 400, //missingMandatoryParameter include must be passed
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter include must be passed
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter include must be passed
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 400, //missingMandatoryParameter include must be passed
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=egg`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal&include=egg",
    //       userEmail: "signedOut",
    //       expectedStatus: 404, //entityNotFoundForInclude include must be correct
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal&include=egg",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 404, //entityNotFoundForInclude include must be correct
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal&include=egg",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 404, //entityNotFoundForInclude include must be correct
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal&include=egg",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 404, //entityNotFoundForInclude include must be correct
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `/regional-countries/19?schema=not-signed-in&filter[slug]=europe-portugal`,
    //   tests: [
    //     {
    //       name: "/19?schema=not-signed-in&filter[slug]=europe-portugal",
    //       userEmail: "signedOut",
    //       expectedStatus: 404, //missingMandatoryParameter
    //       // Only one of countryId value or filter[slug] may be passed
    //     },
    //     {
    //       name: "/19?schema=not-signed-in&filter[slug]=europe-portugal",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter
    //       // Only one of countryId value or filter[slug] may be passed
    //     },
    //     {
    //       name: "/19?schema=not-signed-in&filter[slug]=europe-portugal",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter
    //       // Only one of countryId value or filter[slug] may be passed
    //     },
    //     {
    //       name: "/19?schema=not-signed-in&filter[slug]=europe-portugal",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter
    //       // Only one of countryId value or filter[slug] may be passed
    //     },
    //   ],
    // },
    // {
    //   getUrl: (data) =>
    //     `/regional-countries/99999?schema=not-signed-in&include=staff`,
    //   tests: [
    //     {
    //       name: "/99999?schema=not-signed-in&include=staff",
    //       userEmail: "signedOut",
    //       expectedStatus: 404, //missingMandatoryParameter countryId not found
    //     },
    //     {
    //       name: "/99999?schema=not-signed-in&include=staff",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter countryId not found
    //     },
    //     {
    //       name: "/99999?schema=not-signed-in&include=staff",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter countryId not found
    //     },
    //     {
    //       name: "/99999?schema=not-signed-in&include=staff",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 404, //missingMandatoryParameter countryId not found
    //     },
    //   ],
    // },
    {
      getUrl: (data) =>
        `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=staff`,
      tests: [
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=staff",
          userEmail: "signedOut",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=staff",
          userEmail: "admin@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=staff",
          userEmail: "school-1-school@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=staff",
          userEmail: "endorsed@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
    {
      getUrl: (data) =>
        `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=cities`,
      tests: [
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=cities",
          userEmail: "signedOut",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=cities",
          userEmail: "admin@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=cities",
          userEmail: "school-1-school@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=cities",
          userEmail: "endorsed@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
    {
      getUrl: (data) =>
        `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=photos`,
      tests: [
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=photos",
          userEmail: "signedOut",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=photos",
          userEmail: "admin@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=photos",
          userEmail: "school-1-school@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=photos",
          userEmail: "endorsed@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
    {
      getUrl: (data) =>
        `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=schools`,
      tests: [
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=schools",
          userEmail: "signedOut",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=schools",
          userEmail: "admin@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=schools",
          userEmail: "school-1-school@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=schools",
          userEmail: "endorsed@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
    {
      getUrl: (data) =>
        `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=jobs`,
      tests: [
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=jobs",
          userEmail: "signedOut",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=jobs",
          userEmail: "admin@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=jobs",
          userEmail: "school-1-school@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
        {
          name: "schema=not-signed-in&filter[slug]=europe-portugal&include=jobs",
          userEmail: "endorsed@th.test",
          expectedStatus: 200,
          expectedDataLength: 1,
        },
      ],
    },
    // {
    //   getUrl: (data) =>
    //     `/regional-countries?schema=not-signed-in&filter[slug]=europe-portugal&include=ambassadors`,
    //   tests: [
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal&include=ambassadors",
    //       userEmail: "signedOut",
    //       expectedStatus: 200,
    //       expectedDataLength: 1,
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal&include=ambassadors",
    //       userEmail: "admin@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 1,
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal&include=ambassadors",
    //       userEmail: "school-1-school@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 1,
    //     },
    //     {
    //       name: "schema=not-signed-in&filter[slug]=europe-portugal&include=ambassadors",
    //       userEmail: "endorsed@th.test",
    //       expectedStatus: 200,
    //       expectedDataLength: 1,
    //     },
    //   ],
    // },
  ]
);

tests = tests.sort(shared.compareFnGenerator(["userEmail"]));
tests = tests.filter(
  (t) => includeTestNames == null || includeTestNames.includes(t.name)
);

describe("get-regional-countries", () => {
  beforeAll(async () => {
    await shared.setupBeforeAll();
  });

  describe("GET", () => {
    test.each(tests)("$name => $expectedStatus", async (t: Test.Test) => {
      if (shared.signedInAs != t.userEmail) await shared.signIn(t.userEmail);
      const url = t.getUrl(shared.data);

      if (t.expectedStatus === 200) {
        const response = await shared.api.get(url);
        expect(response.status).toEqual(t.expectedStatus);
        expect(response.data.data.length).toEqual(t.expectedDataLength);
        expect(response).toSatisfyApiSpec();
      } else {
        try {
          await shared.api.get(url);
          console.log("successful by accident");
        } catch (error) {
          expect(error.response.status).toEqual(t.expectedStatus);
          expect(error.response).toSatisfyApiSpec();
        }
      }
    });
  });

  jest.setTimeout(60 * 1000);
  afterAll(async () => {
    await shared.setupAfterAll();
  });
});
