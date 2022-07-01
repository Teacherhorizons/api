export interface School {
  id?: number;
  slug?: string;
}

export interface Teacher {
  id?: number;
  memberNumber?: number;
}

export interface Data {
  schools: School[],
  teachers: Teacher[]
}

export const data: Data = {
  schools: [],
  teachers: []
};
