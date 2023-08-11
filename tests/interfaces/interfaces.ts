declare namespace Config {
  export interface Config {
    baseURL: string;
    auth?: {
      username: string;
      password: string;
    };
    createTestData?: boolean;
    local?: boolean;
  }

  export interface User {
    // token?: string;
    id: number;
    userTypeSlug?: string;
    // userId?: number;
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

  export interface City {
    id?: number;
    slug?: string;
  }

  export interface Country {
    id?: number;
    slug?: string;
  }

  export interface Region {
    id?: number;
    slug?: string;
  }

  export interface Application {
    id?: number;
  }

  export interface ApplicationEvent {
    id?: number;
  }

  export interface UserId {
    id?: number;
  }

  export interface DataIssues {
    id?: number;
    expectedDataLength: number;
  }

  export interface Data {
    test?: Test;
    dataIssues?: DataIssues[];
    schools: School[];
    teachers: Teacher[];
    jobs: Job[];
    cities: City[];
    countries: Country[];
    regions: Region[];
    applications: Application[];
    applicationEvents: ApplicationEvent[];
    users?: User[];
    // asUserId?: UserId[];
  }

  // export const data: Data = {
  //   schools: [],
  //   teachers: [],
  //   jobs: [],
  // };
}
