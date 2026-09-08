"use client";

import Image from "next/image";
import { LECTURER_STEPS, STUDENT_STEPS } from "./data";

const FeatureDetail = ({ query }: { query: "student" | "lecturer" }) => {
  const isLecturer = query === "lecturer";
  const steps = isLecturer ? LECTURER_STEPS : STUDENT_STEPS;

  return (
    <div className="min-h-screen bg-white dark:bg-white text-slate-800 dark:text-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-black capitalize">
            {isLecturer ? "Lecturer Workflow" : "Student Experience"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-900 mt-2">
            Step-by-step breakdown of features available for{" "}
            {`${query[0].toUpperCase()}${query.slice(1)}`}s.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step) => (
            <div key={step.id} className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                    {step.id}
                  </div>
                  <div className="w-0.5 bg-blue-600 grow my-1 min-h-10" />
                </div>

                <div className="space-y-2 pt-0.5">
                  <h2 className="text-xl font-bold text-slate-100 dark:text-slate-900 leading-tight">
                    {step.title}
                  </h2>

                  {step.roleSubtitle && (
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-700">
                      {step.roleSubtitle}
                    </p>
                  )}

                  <div className="space-y-1 text-sm text-slate-700 dark:text-slate-600 leading-relaxed pt-1">
                    {step.descriptions.map((desc, idx) => (
                      <p key={idx}>{desc}</p>
                    ))}
                  </div>

                  <p className="text-sm font-medium text-blue-600 dark:text-blue-600 pt-1">
                    {step.highlightText}
                  </p>
                </div>
              </div>

              <div className="pl-12">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={step.imageUrl}
                    alt={step.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureDetail;
