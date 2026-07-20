"use client";

import { LEGEND_ITEMS } from "../utils/examConstants";

export const Legend = () => {
  return (
    <div className="mt-12 flex flex-wrap justify-center gap-4">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <button
            className={`px-6 py-2.5 ${item.color} text-white text-xs font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5`}
            style={{ pointerEvents: "none" }}
          >
            {item.label}
          </button>
          <span className="text-xs text-gray-500 mt-1">{item.description}</span>
        </div>
      ))}
    </div>
  );
};
