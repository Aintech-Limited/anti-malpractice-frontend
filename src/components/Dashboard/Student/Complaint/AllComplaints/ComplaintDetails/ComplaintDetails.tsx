"use client";
import { IComplaintDetailsProps } from "./interface";

export const ComplaintDetails = ({
  setSelectedComplaint,
  selectedComplaint,
}: IComplaintDetailsProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-10 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl border w-full max-w-lg overflow-hidden transform transition-all">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Complaint Details</h3>
          <button
            onClick={() => setSelectedComplaint(null)}
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <span className="block text-xs uppercase font-semibold text-gray-400 tracking-wider">
              Location
            </span>
            <p className="text-sm font-medium text-gray-800 mt-0.5">
              {selectedComplaint.location}
            </p>
          </div>
          <div>
            <span className="block text-xs uppercase font-semibold text-gray-400 tracking-wider">
              Description
            </span>
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
              {selectedComplaint.description}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={() => setSelectedComplaint(null)}
            className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
