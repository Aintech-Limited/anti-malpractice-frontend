import { SetStateAction } from "react";
import { IStaffFilters } from "../../interface";

export interface IAdvancedFiltersPanelProps {
  departments?: {
    id: string;
    name: string;
  }[];
  setLocalFilters: (value: SetStateAction<IStaffFilters>) => void;
  localFilters: IStaffFilters;
  exams?: {
    id: string;
    title: string;
  }[];
  handleClearFilters: () => void;
  handleApplyFilters: () => void;
}
