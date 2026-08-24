"use client";

import { Edit, Loader2, Shield, Trash2 } from "lucide-react";
import { IRolesTableProps } from "./interface";
import { formatDate } from "@/src/lib/helper";
import { MODULE_COLORS } from "../utils/contants";

export const RolesTable = ({
  isLoading,
  openEditDialog,
  roles,
  searchTerm,
  setDeleteTarget,
  setShowDeleteConfirm,
  getPermissionCountByModule,
}: IRolesTableProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-slate-500 mt-2">Loading roles...</p>
        </div>
      ) : roles.length === 0 ? (
        <div className="p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-600 mt-4">
            No roles found
          </h3>
          <p className="text-slate-500 mt-1">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first role to get started"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-blue-50/50">
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Role Name
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Description
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Permissions
                </th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">
                  Created
                </th>
                <th className="text-right p-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => {
                const moduleCounts = getPermissionCountByModule(role);
                return (
                  <tr
                    key={role.id}
                    className="border-b border-slate-100 hover:bg-linear-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {role.name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {role.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600 max-w-xs truncate">
                        {role.description}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(moduleCounts).map(([module, count]) => (
                          <span
                            key={module}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${MODULE_COLORS[module] || "bg-slate-100 text-slate-700 border-slate-200"}`}
                          >
                            {module} ({count})
                          </span>
                        ))}
                        {!role.rolePermissions?.length && (
                          <span className="text-xs text-slate-400 italic">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {formatDate(role.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditDialog(role)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(role);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
