declare namespace JsonApi {
  export type Application_eventTypesResponse = import('ts-json-api').Response<JsonApi.Application_eventType[]>;

  export interface Application_eventType extends JsonApi.ResourceObject {
    type: 'application-eventTypeAction';
    attributes: {
      name?: string;
      nameForSchool?: string;
      nameForTeacher?: string;
      isVisibleToSchool?: boolean;
      isVisibleToTeacher?: boolean;
      applicationStatus?: JsonApi.IdOnly;
    };
  }
}
