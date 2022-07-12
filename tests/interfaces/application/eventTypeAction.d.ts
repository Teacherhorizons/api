declare namespace JsonApi {
  export type Application_eventTypeActionResponse = import('ts-json-api').Response<JsonApi.Application_eventTypeAction>;

  export interface Application_eventTypeAction extends JsonApi.ResourceObject {
    type: 'application-eventTypeAction';
    attributes: {
      applicationEventType: JsonApi.IdOnly;
      label: string;
      autoEmail?: JsonApi.IdOnly;
    };
    relationships: {
      manualEmailTemplate?: import('ts-json-api').Relationship<JsonApi.General_manualEmailTemplate>;
    };
  }
}
