declare namespace JsonApi {
  export type SchoolResponse = import('ts-json-api').Response<JsonApi.School>;
  export type SchoolsResponse = import('ts-json-api').Response<JsonApi.School[]>;

  export interface School extends JsonApi.ResourceObject {
    type: 'school';
    attributes: {
      name: string;
      slug: string;
      city: JsonApi.IdOnly;
      lraUser?: JsonApi.IdOnly;
      thRating?: number;
      smallProfileImageUrl?: string;
    };
  }
}
