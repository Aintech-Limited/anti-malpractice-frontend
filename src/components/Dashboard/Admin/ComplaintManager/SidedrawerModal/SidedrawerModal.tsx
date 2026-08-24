"use client";

import { useState } from "react";
import { ISidedrawerModalProps } from "./interface";
import { toast } from "react-toastify";

export const SidedrawerModal = ({
  selectedComplaint,
  setSelectedComplaint,
  handleEscalateComplaint,
  admins,
  currentUser,
}: ISidedrawerModalProps) => {
  const [assigneeId, setAssigneeId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end z-10 animate-in fade-in duration-200">
      <div className="bg-white h-screen max-w-lg w-full p-6 lg:p-8 shadow-2xl border-l border-slate-100 overflow-y-auto flex flex-col justify-between transform animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
            <div>
              <span className="text-mono font-bold text-xs text-blue-600">
                {selectedComplaint.id}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {selectedComplaint.category}
              </h3>
            </div>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition"
            >
              Close Review
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Location Reference
              </span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {selectedComplaint.location}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Filing Timestamp
                </span>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  {selectedComplaint.createdAt}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  System Case Priority
                </span>
                <p className="text-xs font-semibold text-rose-600 mt-0.5">
                  {selectedComplaint.priority}
                </p>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Full Description From User
              </span>
              <p className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl mt-1 leading-relaxed">
                &quot;{selectedComplaint.description}&quot;
              </p>
            </div>

            <div className="pt-2">
              <label
                htmlFor="admin-assignee"
                className="text-[10px] uppercase font-bold text-slate-400 block mb-1"
              >
                Assign to Admin
              </label>
              <select
                id="admin-assignee"
                value={assigneeId ?? ""}
                onChange={(e) => {
                  setAssigneeId(e.target.value);
                }}
                className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2polyline%3E%3C%2Fsvg%3E')] bg-size-[1rem_1rem] bg-position-[right_0.75rem_center] bg-no-repeat pr-10"
              >
                <option value="" disabled hidden>
                  Select an admin...
                </option>
                {admins?.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {currentUser.id === admin.id
                      ? "ME"
                      : `${admin?.firstName ?? ""} (${admin?.lastName ?? ""})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex gap-3">
          <button
            onClick={() => setSelectedComplaint(null)}
            className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
          >
            Exit Sheet
          </button>
          <button
            onClick={() => {
              const assignee = admins.find((a) => a.id === assigneeId);
              if (!assignee) {
                toast.error("No Assignee selected!");
                return;
              }
              handleEscalateComplaint(selectedComplaint, assignee);
            }}
            className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition"
          >
            Update Case Dispatch
          </button>
        </div>
      </div>
    </div>
  );
};
