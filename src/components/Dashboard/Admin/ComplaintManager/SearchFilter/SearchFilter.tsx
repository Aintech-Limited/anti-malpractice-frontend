"use client";

import { Filter, Search } from "lucide-react";
import { ISearchFilterProps } from "./interface";
import { ComplaintCategoryEnum, ComplaintStatusEnum } from "@/src/lib/enums";

export const SearchFilter = ({
  setSearchQuery,
  searchQuery,
  setStatusFilter,
  statusFilter,
  setCurrentPage,
  setCategoryFilter,
  categoryFilter,
}: ISearchFilterProps) => {
  return (
    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by ID, city, category..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Filter className="w-3.5 h-3.5" /> Status:
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
        >
          <option value="All">All Complaints</option>
          <option value={ComplaintStatusEnum.PENDING}>Pending Only</option>
          <option value={ComplaintStatusEnum.IN_PROGRESS}>In Progress</option>
          <option value={ComplaintStatusEnum.RESOLVED}>Resolved</option>
        </select>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
          <Filter className="w-3.5 h-3.5" /> Category:
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value={ComplaintCategoryEnum.INFRASTRUCTURE}>
            INFRASTRUCTURE
          </option>
          <option value={ComplaintCategoryEnum.OTHERS}>OTHERS</option>
          <option value={ComplaintCategoryEnum.SANITATION}>SANITATION</option>
          <option value={ComplaintCategoryEnum.SECURITY}>SECURITY</option>
          <option value={ComplaintCategoryEnum.SEXUAL_ASSULT}>
            SEXUAL ASSULT
          </option>
          <option value={ComplaintCategoryEnum.UTILITY}>UTILITY</option>
          <option value={ComplaintCategoryEnum.VIOLENCE}>VIOLENCE</option>
        </select>
      </div>
    </div>
  );
};
