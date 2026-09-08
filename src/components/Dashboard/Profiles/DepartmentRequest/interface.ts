export interface IDepartment {
  id: string;
  name: string;
}

export interface IDepartmentRequestResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface IDepartmentRequestProps {
  departments: IDepartment[];
}
