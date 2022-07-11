export interface Config {
  baseURL: string;
  auth?: {
    username: string;
    password: string;
  };
  createTestData?: boolean;
}

export interface Test {
  id?: number;
}

export interface School {
  id?: number;
  slug?: string;
}

export interface Teacher {
  id?: number;
  memberNumber?: number;
  userId?: number;
}

export interface Job {
  id?: number;
}

export interface Data {
  test?: Test;
  schools: School[];
  teachers: Teacher[];
  jobs: Job[];
}

export const data: Data = {
  schools: [],
  teachers: [],
  jobs: [],
};

export interface JsonApi_ApplicationEventType_ResponseData {
  schema: string;
  data: JsonApi_ApplicationEventType[];
}

export interface ApplicationEventType {
  name: string;
  applicationStatus: any;
}
export interface JsonApi_ApplicationEventType {
  type: string;
  id: string;
  attributes: ApplicationEventType;
}
