"use client";

import { FormEvent, useState } from "react";
import { Building2, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  IDepartmentRequestProps,
  IDepartmentRequestResponse,
} from "./interface";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { useAppDispatch } from "@/src/redux/reduxStore";
import {
  hideLoading,
  showLoading,
} from "@/src/redux/features/globalLoadingSlice/globalLoadingSlice";
import { useRouter } from "next/navigation";

const DepartmentRequest = ({ departments }: IDepartmentRequestProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [departmentId, setDepartmentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (user?.departmentId) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!departmentId) {
      setError("Please select a department.");
      setSuccessMsg(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/v1/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId,
        }),
      });

      const resData: IDepartmentRequestResponse = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(
          resData.message || "Failed to submit department request.",
        );
      }

      dispatch(showLoading("Updating Department"));

      setSuccessMsg(
        resData.message || "Department request submitted successfully!",
      );

      const departmentName = departments?.find(
        (d) => d.id === departmentId,
      )?.name;

      updateUser({ departmentId, departmentName });

      dispatch(hideLoading());

      setDepartmentId("");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while submitting your request.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-blue-50">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Request Department Access
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
          Select the department you would like to join and submit your request
          for approval.
        </p>

        <p className="text-xs sm:text-sm text-red-600 mt-1 max-w-sm animate-pulse">
          You can only do this once!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="department"
            className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
          >
            Department
          </label>

          <select
            id="department"
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setError(null);
              setSuccessMsg(null);
            }}
            disabled={isSubmitting}
            className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:cursor-not-allowed"
          >
            <option value="">Select a department</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !departmentId}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting request...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Request Department
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-red-500 font-medium text-center bg-red-50 py-2 px-3 rounded-lg border border-red-100 w-full">
          {error}
        </p>
      )}

      {successMsg && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium text-center bg-emerald-50 py-2 px-3 rounded-lg border border-emerald-100 w-full">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </p>
      )}
    </div>
  );
};

export default DepartmentRequest;
