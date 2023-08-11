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

  // TODO - WIP
  export interface HttpPayload<A> {
    data?: A;
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

// TODO: move elsewhere
declare namespace Sort {
  export type ItemMap = (n: any) => any;

  export interface SortConfig<T> {
    key: keyof T;
    reverse?: boolean;
    map?: ItemMap;
  }
}

declare namespace Test {
  export interface Test {
    getUrl: (data: Config.Data) => string;
    getPayload?: (data: Config.Data) => object;
    name?: string;
    userEmail: string;
    expectedStatus: number;
    getPassesCustomChecks?: (response: JsonApi.Response, data: Config.Data) => boolean;

    /**
     * @deprecated TODO: remove (once no longer used)
     */
    expectedDataLength?: number;

    /**
     * @deprecated TODO: remove (once no longer used)
     */
    count?: number;

    /**
     * @deprecated TODO: remove (once no longer used)
     */
    payloadId?: number;
  }

  export interface TestGroup {
    getUrl: (data?: Config.Data) => string;
    getPayload?: (data: Config.Data) => object;
    tests: Pick<
      Test,
      'name' | 'userEmail' | 'expectedStatus' | 'expectedDataLength' | 'getPassesCustomChecks' | 'payloadId' | 'count'
    >[];
  }
}
