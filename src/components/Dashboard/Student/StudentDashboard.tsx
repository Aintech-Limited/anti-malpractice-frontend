"use client";

import { Radio, BarChart2 } from "lucide-react";
import DashboardExamRow from "./DashboardExamRow/DashboardExamRow";
import { useRouter } from "next/navigation";
import { IStudentDashboardProps } from "./interface";
import { EmptyState } from "../../common/EmptyState/EmptyState";

const StudentDashboard = ({ initialData }: IStudentDashboardProps) => {
  const router = useRouter();

  const noPlanToday =
    initialData.liveExams.length < 1 &&
    initialData.results.length < 1 &&
    initialData.upcomingExamsThisWeek.length < 1 &&
    initialData.upcomingExamsToday.length < 1;

  return (
    <section className="bg-[#E9EEF2] min-h-screen p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Overview */}
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          <div className="space-y-20">
            {initialData.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm flex flex-col cursor-pointer
                           transition-all duration-300 ease-out
                           hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/5 active:scale-95"
                onClick={() => {
                  if (stat.label === "Online Exam") {
                    router.push("/dashboard/students/exams");
                  }
                }}
              >
                <span className="text-gray-900 font-bold text-lg mb-4">
                  {stat.label}
                </span>
                <span className="text-4xl font-bold text-gray-800 self-end">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {noPlanToday ? (
          <EmptyState title="No Plan today" />
        ) : (
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Today Plan
            </h2>
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              {/* Live Exam Section */}
              {initialData.liveExams.length > 0 && (
                <div className="mb-8">
                  <div className="bg-[#EF5350] w-fit flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold mb-6 animate-pulse-red">
                    <Radio size={20} className="animate-ping" />
                    <span className="uppercase text-sm tracking-wide">
                      Live Exam
                    </span>
                  </div>

                  <div className="space-y-4">
                    {initialData.liveExams.map((live) => {
                      return (
                        <DashboardExamRow
                          key={live.id}
                          time={live.time}
                          title={live.title}
                          actionText="Go to Exam"
                          isLive={true}
                          id={live.id}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <hr className="border-gray-100 my-8" />

              {/* Upcoming Exam Today Section */}
              {initialData.upcomingExamsToday.length > 0 && (
                <div className="mb-8">
                  <div className="bg-[#2da354] w-fit flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold mb-6 animate-pulse-red">
                    <Radio size={20} className="animate-spin" />
                    <span className="uppercase text-sm tracking-wide">
                      Upcoming Exam Today
                    </span>
                  </div>

                  <div className="space-y-4">
                    {initialData.upcomingExamsToday.map((upcoming) => {
                      return (
                        <DashboardExamRow
                          key={upcoming.id}
                          time={upcoming.time}
                          title={upcoming.title}
                          actionText="Get Ready!"
                          isLive={false}
                          id={upcoming.id}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <hr className="border-gray-100 my-8" />
              {/* Upcoming Exam This Week Section */}
              {initialData.upcomingExamsThisWeek.length > 0 && (
                <div className="mb-8">
                  <div className="bg-[#2da354] w-fit flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold mb-6 animate-pulse-red">
                    <Radio size={20} className="animate-spin" />
                    <span className="uppercase text-sm tracking-wide">
                      Upcoming Exam This Week
                    </span>
                  </div>

                  <div className="space-y-4">
                    {initialData.upcomingExamsThisWeek.map((upcoming) => {
                      return (
                        <DashboardExamRow
                          key={upcoming.id}
                          time={upcoming.time}
                          title={upcoming.title}
                          actionText="Get Ready!"
                          isLive={false}
                          id={upcoming.id}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <hr className="border-gray-100 my-8" />

              {/* Results Section */}
              {initialData.results.length > 0 && (
                <div>
                  <div className="bg-[#1A1AFF] w-fit flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold mb-6">
                    <BarChart2 size={20} />
                    <span className="uppercase text-sm tracking-wide">
                      Results
                    </span>
                  </div>
                  <div className="space-y-4">
                    {initialData.results.map((result) => {
                      return (
                        <DashboardExamRow
                          key={result.id}
                          time={result.time}
                          title={result.title}
                          actionText="View Result"
                          isLive={false}
                          id={result.id}
                          isResult={true}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentDashboard;
