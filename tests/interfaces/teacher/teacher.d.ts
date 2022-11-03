declare namespace JsonApi {
  export type TeacherResponse = import('ts-json-api').Response<JsonApi.Teacher>;

  export interface Teacher extends JsonApi.ResourceObject {
    type: 'teacher';
    attributes: {
      profilePhotoUrl?: string;
      fullName?: string;
      thPlaceabilityRating?: number;
      memberNumber?: number;
      thDoNotContact?: number; // TODO: switch to boolean
    };
  }
}
