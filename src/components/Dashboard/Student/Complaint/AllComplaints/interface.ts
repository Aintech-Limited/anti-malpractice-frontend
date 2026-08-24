export interface IComplaintsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export interface IComplaint {
  id: string;
  category: string;
  location: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMeta {
  page?: number;
  limit?: number;
  totalItems?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface IComplaintsClientProps {
  initialData: IComplaint[];
  meta: IMeta;
  currentFilters: Record<string, any>;
}
