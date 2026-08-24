"use client";

import { AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import { ICreateEditDialogProps } from "./interface";
import { MODULE_COLORS } from "../utils/contants";

export const CreateEditDialog = ({
  setShowDialog,
  editingRole,
  formDescription,
  formErrors,
  formName,
  groupedPermissions,
  selectedPermissions,
  setFormName,
  toggleAllModulePermissions,
  toggleModule,
  expandedModules,
  setFormDescription,
  togglePermission,
  handleSubmit,
  isSubmitting,
}: ICreateEditDialogProps) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowDialog(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {editingRole ? "Edit Role" : "Create New Role"}
          </h2>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., SCHOOL_ADMIN"
                className={`w-full px-4 py-2 rounded-lg border ${
                  formErrors.name
                    ? "border-red-300 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                } outline-none focus:ring-2 focus:ring-blue-100 transition-all`}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe the role's purpose..."
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${
                  formErrors.description
                    ? "border-red-300 focus:border-red-500"
                    : "border-slate-200 focus:border-blue-400"
                } outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-y`}
              />
              {formErrors.description && (
                <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.description}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Permissions <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-slate-500">
                  {selectedPermissions.size} selected
                </span>
              </div>
              {formErrors.permissions && (
                <p className="text-sm text-red-500 mb-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.permissions}
                </p>
              )}

              <div className="border border-slate-200 rounded-lg bg-slate-50/50 p-4 max-h-100 overflow-y-auto">
                <div className="space-y-2">
                  {Object.entries(groupedPermissions).map(
                    ([module, permissions]) => (
                      <div key={module}>
                        <div
                          className="flex items-center justify-between cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors"
                          onClick={() => toggleModule(module)}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${MODULE_COLORS[module] || "bg-slate-100 text-slate-700 border-slate-200"}`}
                            >
                              {module}
                            </span>
                            <span className="text-sm text-slate-600">
                              {permissions.length} permissions
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAllModulePermissions(module);
                              }}
                              className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              {permissions.every((p) =>
                                selectedPermissions.has(p.id),
                              )
                                ? "Deselect All"
                                : "Select All"}
                            </button>
                            <ChevronDown
                              className={`h-4 w-4 text-slate-400 transition-transform ${expandedModules.has(module) ? "rotate-180" : ""}`}
                            />
                          </div>
                        </div>

                        {expandedModules.has(module) && (
                          <div className="ml-4 space-y-1 mt-1">
                            {permissions.map((permission) => (
                              <label
                                key={permission.id}
                                className="flex items-center gap-2 p-2 hover:bg-white/50 rounded-lg cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.has(
                                    permission.id,
                                  )}
                                  onChange={() =>
                                    togglePermission(permission.id)
                                  }
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-700">
                                    {permission.name}
                                  </p>
                                  <p className="text-xs text-slate-500 truncate">
                                    {permission.description}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={() => setShowDialog(false)}
            className="px-4 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {editingRole ? "Updating..." : "Creating..."}
              </>
            ) : editingRole ? (
              "Update Role"
            ) : (
              "Create Role"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
