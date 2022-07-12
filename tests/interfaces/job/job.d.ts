declare namespace JsonApi {
  export type JobResponse = import('ts-json-api').Response<JsonApi.Job>;

  export interface Job extends JsonApi.ResourceObject {
    type: 'job';
    attributes: {
      title: string;
      thOwnerUser: JsonApi.IdOnly;
      subject: JsonApi.IdOnly;
      role: JsonApi.IdOnly;
      startDate: JsonApi.Date;
      status: JsonApi.IdOnly;
    };
    relationships: {
      school: import('ts-json-api').Relationship<JsonApi.School>;
    };
  }
}
