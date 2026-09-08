import { useState } from "react";
import { useRouter } from "next/navigation";
import { IFilters, IPaymentApiResponse } from "../interface";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { UserRoleTypeEnum } from "@/src/lib/enums";

export const usePaymentFilters = (initialFilters: IFilters) => {
  const router = useRouter();
  const { user } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (newFilters: Partial<IFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);

    const params = new URLSearchParams();
    params.set("page", updated.page.toString());
    params.set("limit", updated.limit.toString());
    if (updated.type) params.set("type", updated.type);
    if (updated.sortBy) params.set("sortBy", updated.sortBy);

    router.push(
      `/dashboard/${user?.role === UserRoleTypeEnum.LECTURER ? "lecturers" : user?.role === UserRoleTypeEnum.STUDENT ? "students" : "vendors"}/finance/history?${params.toString()}`,
    );
  };

  const fetchPage = async (page: number): Promise<IPaymentApiResponse> => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", filters.limit.toString());
    if (filters.type) params.set("type", filters.type);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);

    const response = await fetch(`/api/v1/payments?${params}`);
    const data = await response.json();

    return data;
  };

  const clearFilters = () => {
    updateFilters({ type: "", sortBy: "createdAt", page: 1 });
  };

  const hasActiveFilters =
    filters.type !== "" || filters.sortBy !== "createdAt";

  return {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilters,
    fetchPage,
    clearFilters,
  };
};
