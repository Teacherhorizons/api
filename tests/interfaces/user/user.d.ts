declare namespace JsonApi {
  export type UserResponse = import('ts-json-api').Response<JsonApi.User>;

  export interface User extends JsonApi.ResourceObject {
    type: 'user';
    id: JsonApi.Id;
    attributes: {
      fullName: string;
    };
  }
}
