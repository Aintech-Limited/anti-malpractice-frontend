import {
  TComplaintCategoryEnum,
  TComplaintPriorityEnum,
  TComplaintStatusEnum,
} from "@/src/lib/enums";

export interface IComplaintRecord {
  id: string;
  category: TComplaintCategoryEnum;
  location: string;
  description: string;
  priority: TComplaintPriorityEnum;
  status: TComplaintStatusEnum;
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    image?: string;
  };
  createdAt: string;
  updatedAt?: string;
}
export interface IAdminComplaintsManagerProps {
  initialComplaints: IAdminComplaintResponse["data"];
  meta: IAdminComplaintResponse["meta"];
  message: IAdminComplaintResponse["message"];
  success: IAdminComplaintResponse["success"];
}

export interface IAdminComplaintResponse {
  message: string;
  success: boolean;
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  data: IComplaintRecord[];
}

export type TAssigneeAdmins = IComplaintRecord["student"];
