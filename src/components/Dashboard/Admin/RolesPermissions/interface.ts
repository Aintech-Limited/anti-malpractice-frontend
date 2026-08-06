export interface IPermission {
  id: string;
  name: string;
  description: string;
}

export interface IRolePermission {
  permission: {
    id: string;
    name: string;
    description: string;
    module: string;
  };
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  rolePermissions?: IRolePermission[];
}

export interface IGetRoleResponse {
  data: IRole[];
  meta: IMeta;
  message: string;
  success: boolean;
}

export interface IGroupedPermissions {
  [module: string]: IPermission[];
}

export interface IGetGroupedPermissionResponse {
  data: IGroupedPermissions;
  message: string;
  success: boolean;
}

export interface IMeta {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IRolesPageClientProps {
  initialRoles: IRole[];
  initialMeta: IMeta;
  groupedPermissions: IGroupedPermissions;
}

export interface ISearchParams {
  page?: string;
  limit?: string;
  search?: string;
  includePermissions?: string;
}

export interface IValidatedParams {
  page: number;
  limit: number;
  search?: string;
  includePermissions: boolean;
}
