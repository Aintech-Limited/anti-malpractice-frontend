"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { ISalesByCountry } from "../interface";
import { getTopEaraning } from "../util/util";

export default function SalesByCountries({ data }: { data: ISalesByCountry }) {
  const topEarning = getTopEaraning(data.offices);
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between w-full max-w-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold border-b-2 border-black pb-1 cursor-pointer text-sm tracking-wide">
          Sales by Countries
        </h2>
        <div className="flex gap-4 text-xs font-medium text-slate-600">
          <button className="flex items-center gap-1 hover:text-black transition">
            All Products <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 hover:text-black transition">
            Top Countries <ChevronDown className="w-3 h-3" />
          </button>
          <ArrowUpRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 items-center">
        <div className="sm:col-span-2 space-y-4">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-0.5">
              Top Performing
            </span>
            <span className="text-2xl font-bold text-slate-900">
              ₦{topEarning}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-0.5">
              Revenue Growth
            </span>
            <span className="text-2xl font-bold text-slate-900">
              {data.revenueGrowth}%
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-0.5">
              Period
            </span>
            <span className="text-2xl font-bold text-slate-900">
              {data.period}
            </span>
          </div>
        </div>

        <div className="sm:col-span-3 relative bg-[#FFF0F2] rounded-3xl p-6 border border-rose-100/60 flex items-center justify-center min-h-65 overflow-hidden">
          <span className="absolute top-[38%] left-[45%] text-[10px] font-semibold text-slate-500/40 pointer-events-none tracking-wider">
            Northern Region
          </span>
          <span className="absolute bottom-[28%] left-[24%] text-[9px] font-semibold text-slate-500/40 pointer-events-none tracking-wider">
            Western Region
          </span>
          <span className="absolute bottom-[22%] left-[64%] text-[9px] font-semibold text-slate-500/40 pointer-events-none tracking-wider">
            Eastern Region
          </span>
          <span className="absolute bottom-3 right-4 text-[9px] font-mono text-slate-400 tracking-widest">
            2026 - Present
          </span>

          <svg
            className="w-full h-auto max-h-52.5 opacity-80 mix-blend-multiply"
            viewBox="0 0 200 170"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 50 C 25 35, 45 38, 55 35 C 65 32, 70 20, 85 20 C 100 20, 115 35, 130 25 C 145 15, 170 20, 180 35 C 190 50, 185 70, 185 85 C 185 100, 175 110, 165 125 C 155 140, 140 145, 125 150 C 115 153, 105 130, 95 135 C 85 140, 75 155, 65 155 C 55 155, 45 135, 35 125 C 25 115, 30 100, 25 90 C 20 80, 10 75, 10 65 Z"
              fill="#FEE2E2"
              stroke="#FCA5A5"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>

          {data?.offices?.[0] && (
            <div className="absolute top-[20%] left-[10%] bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-md border border-slate-100 text-center transition-transform hover:scale-105 cursor-pointer">
              <p className="text-[9px] text-slate-400 font-medium leading-none mb-0.5">
                {data?.offices?.[0]?.name} Office
              </p>
              <p className="font-bold text-[11px] text-slate-800">
                {data?.offices?.[0]?.amount} Naira
              </p>
            </div>
          )}
          {data?.offices?.[1] && (
            <div className="absolute top-[20%] left-[10%] bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-md border border-slate-100 text-center transition-transform hover:scale-105 cursor-pointer">
              <p className="text-[9px] text-slate-400 font-medium leading-none mb-0.5">
                {data?.offices?.[1]?.name} Office
              </p>
              <p className="font-bold text-[11px] text-slate-800">
                {data?.offices?.[1]?.amount} Naira
              </p>
            </div>
          )}
          {data?.offices?.[2] && (
            <div className="absolute top-[20%] left-[10%] bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-md border border-slate-100 text-center transition-transform hover:scale-105 cursor-pointer">
              <p className="text-[9px] text-slate-400 font-medium leading-none mb-0.5">
                {data?.offices?.[2]?.name} Office
              </p>
              <p className="font-bold text-[11px] text-slate-800">
                {data?.offices?.[2]?.amount} Naira
              </p>
            </div>
          )}
          {data?.offices?.[3] && (
            <div className="absolute top-[20%] left-[10%] bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-md border border-slate-100 text-center transition-transform hover:scale-105 cursor-pointer">
              <p className="text-[9px] text-slate-400 font-medium leading-none mb-0.5">
                {data?.offices?.[3]?.name} Office
              </p>
              <p className="font-bold text-[11px] text-slate-800">
                {data?.offices?.[3]?.amount} Naira
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
