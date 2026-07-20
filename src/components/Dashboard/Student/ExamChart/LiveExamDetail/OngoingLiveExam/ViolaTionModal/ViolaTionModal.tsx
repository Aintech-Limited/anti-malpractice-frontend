"use client";

import { TViolation } from "@/src/lib/proctoring/interface";
import { UserCheck } from "lucide-react";

const ViolaTionModal = ({ violations }: { violations: TViolation[] }) => {
  return (
    <div className="fixed inset-0 z-200 bg-red-600/90 backdrop-blur-sm flex items-center justify-center text-white p-10 text-center">
      <div className="max-w-md">
        <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <UserCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">
          Face Not Detected!
        </h2>
        <p className="text-lg font-medium opacity-90">
          Exam on Hold. Please reposition yourself clearly in front of the
          camera to resume.
        </p>
        <div className="mt-8 text-sm font-mono bg-black/20 py-2 px-4 rounded-full inline-block">
          {violations.filter((v) => v.type === "NO_FACE").length} face
          violations recorded
        </div>
        {violations.filter((v) => v.type === "NO_FACE").length > 3 && (
          <div className="mt-4 text-xs bg-black/40 p-2 rounded-lg">
            ⚠️ Multiple face detection violations may affect your exam result
          </div>
        )}
      </div>
    </div>
  );
};

export default ViolaTionModal;
