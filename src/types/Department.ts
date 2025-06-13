export type Department = {
  id: number;
  name: string;
  code: string;
  description: string;
  parentDepartmentId?: number | null;
  parentDepartmentName?: string | null;
};

export const defaultDepartment: Department = {
  id: 0,
  name: "",
  code: "",
  description: "",
  parentDepartmentId: null,
  parentDepartmentName: null,
};