"use client";

import { useState } from "react";
import Link from "next/link";
import { ROLES } from "./data";

const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState<"lecturer" | "student">(
    "lecturer",
  );

  const activeRole = ROLES.find((r) => r.id === activeTab) || ROLES[0];

  return (
    <section
      id="howitworks"
      className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 transition-colors border-2 border-slate-100"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 py-1.5 px-3.5 rounded-full border border-blue-100">
            How It Works
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored Experiences for Everyone
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Whether you&apos;re teaching the course or taking it, our platform
            empowers your digital learning journey.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 backdrop-blur-sm border border-slate-200">
            {ROLES.map((role) => {
              const isActive = activeTab === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-white text-blue-600 shadow-md shadow-slate-200/50"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={isActive ? "text-blue-600" : "text-slate-400"}
                  >
                    {role.icon}
                  </span>

                  <span>{role.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                  {activeRole.icon}
                </div>

                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                    {activeRole.badge}
                  </span>

                  <h3 className="text-2xl font-bold text-slate-900">
                    {activeRole.title}
                  </h3>
                </div>
              </div>

              <p className="text-lg font-medium text-slate-800">
                {activeRole.tagline}
              </p>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {activeRole.description}
              </p>

              <div className="pt-2">
                <Link
                  href={`/feature-detail?q=${activeRole.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
                >
                  <span>Explore {activeRole.title} Features</span>

                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Key Platform Benefits
              </h4>

              <ul className="space-y-3">
                {activeRole.benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-slate-700"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mt-0.5">
                      ✓
                    </span>

                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {ROLES.map((role) => (
            <Link
              key={role.id}
              href={`/feature-detail?q=${role.id}`}
              className="group relative p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-slate-900 font-bold">
                    <span className="text-blue-600">{role.icon}</span>

                    <span>{role.title}</span>
                  </div>

                  <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                    Learn more &rarr;
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {role.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
