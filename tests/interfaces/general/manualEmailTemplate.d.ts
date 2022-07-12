declare namespace JsonApi {
  export type General_manualEmailTemplateResponse = import('ts-json-api').Response<JsonApi.General_manualEmailTemplate>;

  export interface General_manualEmailTemplate extends JsonApi.ResourceObject {
    type: 'general-manualEmailTemplate';
    id: JsonApi.Id;
    attributes: {
      to: string;
      cc: string;
      bcc: string;
      subject: string;
      body: string;
    };
  }
}
