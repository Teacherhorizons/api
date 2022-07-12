declare namespace JsonApi {
  type ResourceObject = import('ts-json-api').ResourceObject;
  type ResourceObjectOrObjects = import('ts-json-api').ResourceObjectOrObjects;

  type Relationship = import('ts-json-api').Relationship;
  type Relationships = import('ts-json-api').Relationships;

  type Response = import('ts-json-api').Response;
  type ResponseWithMetaData = import('ts-json-api').ResponseWithMetaData;

  type ApiResponse = import('ts-json-api').ApiResponse;

  export interface HttpResponse<A extends JsonApi.Response> {
    data?: A;
    status: 200 | 400 | 401; // TODO
  }

  export type Id = string;
  export type Date = string;

  // slightly non-standard json-api, but it makes for easier integration with our current apis
  export type IdOnly = {
    id: JsonApi.Id;
  };

  export type EntityType =
    | 'application'
    | 'applicationEvent'
    | 'application-eventTypeActions'
    | 'city'
    | 'job'
    | 'manualEmailTemplate'
    | 'school'
    | 'teacher'
    | 'user';
}
