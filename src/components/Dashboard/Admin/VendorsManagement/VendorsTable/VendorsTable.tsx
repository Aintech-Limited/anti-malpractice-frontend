"use client";

import { TVendorAction } from "../interface";
import { IVendorsTableProps } from "./interface";

export const VendorsTable = ({
  isLoading,
  isVendorApproved,
  vendors,
  openModal,
}: IVendorsTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3">Vendor / Institution</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Gender / DOB</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Created Date</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading vendors...
                </div>
              </td>
            </tr>
          ) : vendors.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                No vendors found matching criteria.
              </td>
            </tr>
          ) : (
            vendors.map((vendor) => {
              const approved = isVendorApproved(vendor);
              return (
                <tr
                  key={vendor.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {vendor.firstName || vendor.lastName
                        ? `${vendor.firstName} ${vendor.lastName}`.trim()
                        : "N/A"}
                    </div>
                    <div className="text-xs text-blue-600">
                      {vendor.institution?.name || "No Institution"} (
                      {vendor.institution?.code || "N/A"})
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {vendor.email || vendor.institution?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {vendor.profile?.sex || "N/A"} |{" "}
                    {vendor.profile?.dob || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {approved ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Revoked or Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block text-left">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const act = e.target.value as TVendorAction;
                          if (act) {
                            openModal(act, vendor);
                            e.target.value = ""; // Reset dropdown selection
                          }
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="" disabled>
                          Actions...
                        </option>
                        {!approved ? (
                          <option value="approve">Approve</option>
                        ) : (
                          <option value="revoke">Revoke</option>
                        )}
                        <option value="remove">Remove</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
