import { TInstitutionLevelEnum } from "@/src/lib/enums";
import { IMeta } from "../RolesPermissions/interface";

export interface IDepartment {
  id: string;
  name: string;
}

export interface IInstitution {
  id: string;
  createdAt: string;
  updatedAt: string;
  institutionLevel: TInstitutionLevelEnum;
  name: string;
  location?: string;
  address?: string;
  logoUrl?: string;
  bannerUrl?: string;
  motto?: string;
  email?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  code?: string;
  establishedYear?: number;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  departments?: IDepartment[];
}

export interface IGetInstitutionApiResponse<T> {
  message: string;
  success: boolean;
  meta: IMeta;
  data: T;
}

export interface IInstitutionsClientProps {
  initialInstitutions: IInstitution[];
  initialMeta: IMeta;
}
