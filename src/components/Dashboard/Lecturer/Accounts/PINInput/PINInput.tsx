"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { IPINInputProps } from "./interface";

export default function PINInput({
  value,
  onChange,
  label,
  showToggle = true,
}: IPINInputProps) {
  const [showPIN, setShowPIN] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPIN(!showPIN)}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            {showPIN ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {showPIN ? "Hide" : "Show"} PIN
          </button>
        )}
      </div>

      {/* Responsive PIN Input Container */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {value.map((digit, index) => (
          <div key={index} className="flex-1 min-w-12.5 max-w-17.5">
            <input
              type={showPIN ? "text" : "password"}
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                if (val.length <= 1) {
                  onChange(index, val);
                  if (val && index < value.length - 1) {
                    const nextInput = document.getElementById(
                      `pin-input-${index + 1}`,
                    );
                    nextInput?.focus();
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digit && index > 0) {
                  const prevInput = document.getElementById(
                    `pin-input-${index - 1}`,
                  );
                  prevInput?.focus();
                }
              }}
              id={`pin-input-${index}`}
              className="w-10 aspect-square text-center text-xl font-bold 
								border-2 border-gray-300 rounded-xl 
								focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 
								transition-all hover:border-indigo-300
								disabled:opacity-50 disabled:cursor-not-allowed
								shadow-sm"
              style={{
                fontSize: "clamp(1rem, 5vw, 1.25rem)",
              }}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-3 sm:hidden">
        Enter 4-digit PIN
      </p>
    </div>
  );
}
