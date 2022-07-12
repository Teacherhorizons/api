declare namespace JsonApi {
  export type ApplicationsResponse = import('ts-json-api').Response<JsonApi.Application[]>;
  export type ApplicationResponse = import('ts-json-api').Response<JsonApi.Application>;

  export interface Application extends JsonApi.ResourceObject {
    type: 'application';
    attributes: {
      thMatchType: JsonApi.IdOnly;
      thSystemMatchScore: number;
      status: JsonApi.IdOnly;
      latestUpdateDate: JsonApi.Date;
      recommendationText: string;
      hasDataIssues: boolean;
      contactStage: JsonApi.IdOnly;
      // teacher: JsonApi.IdOnly; // where are you getting this teacher then
    };
    relationships: {
      job: import('ts-json-api').Relationship<JsonApi.Job>;
      teacher: import('ts-json-api').Relationship<JsonApi.Teacher>;
      latestEvent: import('ts-json-api').Relationship<JsonApi.Application_applicationEvent>;
    };
  }
}
