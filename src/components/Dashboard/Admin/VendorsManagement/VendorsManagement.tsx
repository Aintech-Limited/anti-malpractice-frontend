"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import {
  IActionApiResponse,
  IActionModalState,
  IVendor,
  IVendorApiResponse,
  IVendorsManagementProps,
  TVendorAction,
  TVendorStatusFilter,
} from "./interface";
import { IMeta } from "../RolesPermissions/interface";
import { WarningDialog } from "./WarningDialog/WarningDialog";
import { VendorsTable } from "./VendorsTable/VendorsTable";
import { useAppSelector } from "@/src/redux/reduxStore";
import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";
import BaseClientWrapper from "@/src/components/common/BaseClientWrapper/BaseClientWrapper";

export default function VendorsManagement({
  initialVendors,
  initialMeta,
}: IVendorsManagementProps) {
  const { userRoles } = useAppSelector((state) => state.auth);
  const [vendors, setVendors] = useState<IVendor[]>(initialVendors);
  const [meta, setMeta] = useState<IMeta>(initialMeta);
  const [page, setPage] = useState<number>(initialMeta.page || 1);
  const [limit] = useState<number>(50);
  const [searchId, setSearchId] = useState<string>("");
  const [status, setStatus] = useState<TVendorStatusFilter>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [modal, setModal] = useState<IActionModalState>({
    isOpen: false,
    type: null,
    vendor: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const isVendorApproved = (vendor: IVendor): boolean => {
    return Array.isArray(vendor.userRoles) && vendor.userRoles.length > 0;
  };

  const fetchVendors = useCallback(async () => {
    if (!userRoles?.permissions?.vendor?.read) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const query = new URLSearchParams();
      query.append("page", page.toString());
      query.append("limit", limit.toString());

      if (searchId.trim()) {
        query.append("vendorId", searchId.trim());
      }

      if (status !== "ALL") {
        query.append("status", status);
      }

      const res = await fetch(`/api/v1/vendors?${query.toString()}`, {
        signal: controller.signal,
      });

      const result: IVendorApiResponse = await res.json();

      if (result.success) {
        setVendors(result.data);
        setMeta(result.meta);
      } else {
        toast.error(result.message || "Failed to fetch vendors");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("An error occurred while fetching vendors.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userRoles?.permissions?.vendor?.read, page, limit, searchId, status]);

  useEffect(() => {
    fetchVendors();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchVendors]);

  if (!userRoles?.permissions?.vendor?.read)
    return <EmptyState title="Nothing to display here" />;

  const executeAction = async () => {
    if (!modal.vendor || !modal.type) return;

    setActionLoading(true);
    const { id } = modal.vendor;
    const action = modal.type;

    try {
      const method = action === "remove" ? "DELETE" : "POST";
      const res = await fetch(`/api/v1/vendors/${id}/${action}`, {
        method,
        headers: { "Content-Type": "application/json" },
      });

      const result: IActionApiResponse = await res.json();

      if (result.success) {
        toast.success(result.message || `Vendor ${action}d successfully`);
        closeModal();
        fetchVendors(); // Refresh state
      } else {
        toast.error(result.message || `Failed to ${action} vendor`);
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (type: TVendorAction, vendor: IVendor) => {
    setModal({ isOpen: true, type, vendor });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, vendor: null });
  };

  return (
    <BaseClientWrapper>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-blue-900">Vendor Management</h1>
        <span className="text-sm text-gray-500">
          Total Vendors:{" "}
          <strong className="text-blue-600">{meta.totalItems}</strong>
        </span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by Vendor ID (UUID)..."
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Status Filter:
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as TVendorStatusFilter);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="REVOKED">Revoked or Unapproved</option>
          </select>
        </div>
      </div>

      <VendorsTable
        isLoading={isLoading}
        isVendorApproved={isVendorApproved}
        meta={meta}
        openModal={openModal}
        setPage={setPage}
        vendors={vendors}
      />

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-xs text-gray-600">
          Page <span className="font-semibold">{meta.page}</span> of{" "}
          <span className="font-semibold">{meta.totalPages}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={!meta.hasPreviousPage || isLoading}
            className="px-3 py-1.5 border border-gray-300 text-xs rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!meta.hasNextPage || isLoading}
            className="px-3 py-1.5 border border-gray-300 text-xs rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>

      {modal.isOpen && modal.vendor && (
        <WarningDialog
          actionLoading={actionLoading}
          closeModal={closeModal}
          executeAction={executeAction}
          modal={modal}
        />
      )}
    </BaseClientWrapper>
  );
}
