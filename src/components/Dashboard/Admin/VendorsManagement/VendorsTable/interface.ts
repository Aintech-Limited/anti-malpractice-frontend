import { SetStateAction } from "react";
import { IVendor, TVendorAction } from "../interface";
import { IMeta } from "../../RolesPermissions/interface";

export interface IVendorsTableProps {
  isLoading: boolean;
  vendors: IVendor[];
  isVendorApproved: (vendor: IVendor) => boolean;
  setPage: (value: SetStateAction<number>) => void;
  meta: IMeta;
  openModal: (type: TVendorAction, vendor: IVendor) => void;
}
