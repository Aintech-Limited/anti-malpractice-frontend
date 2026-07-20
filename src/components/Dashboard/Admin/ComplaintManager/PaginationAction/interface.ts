import { IComplaintRecord } from "../interface";

export interface IPaginationActionProps {
  currentPage: number;
  itemsPerPage: number;
  filteredRecords: IComplaintRecord[];
  handlePageChange: (newPage: number) => void;
  totalPages: number;
}
