declare namespace JsonApi {
  export type ApplicationEventResponse = import('ts-json-api').Response<JsonApi.Application_applicationEvent>;

  export interface Application_applicationEvent extends JsonApi.ResourceObject {
    type: 'application-applicationEvent';
    attributes: {
      date: JsonApi.Date;
      application?: JsonApi.IdOnly;
      type: JsonApi.IdOnly;
      notes: string;
      creationDate: JsonApi.Date;
      latestUpdateDate: JsonApi.Date;
    };
    relationships: {
      application?: import('ts-json-api').Relationship<JsonApi.Application>;
      creationUser: import('ts-json-api').Relationship<JsonApi.User>;
      latestUpdateUser: import('ts-json-api').Relationship<JsonApi.User>;
    };
  }
}
