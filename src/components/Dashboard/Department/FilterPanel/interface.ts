export interface IDepartmentFilterPanelProps {
  sortBy: "name" | "createdAt";
  limit: number;
  onSortChange: (sort: "name" | "createdAt") => void;
  onLimitChange: (limit: number) => void;
}
