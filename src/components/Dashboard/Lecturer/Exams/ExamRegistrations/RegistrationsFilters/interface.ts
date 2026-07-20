export interface IRegistrationsFiltersProps {
  filters: any;
  showFilters: boolean;
  hasActiveFilters: boolean;
  onToggleFilters: () => void;
  onUpdateFilters: (filters: any) => void;
  onClearFilters: () => void;
}
