"use client";
import { liveExams, offlineExams, upcomingExams } from "./data";
import ExamSection from "./ExamSection/ExamSection";
import FilterDropdown from "./FilterDropDown/FilterDropDown";

const ExamsChart = () => {
  return (
    <section className="bg-[#F8FAFC] py-16 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Courses Appropriately in the Schedule.
        </h1>

        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-20">
          <FilterDropdown label="Course Type" placeholder="Lecture Lab" />
          <FilterDropdown label="Time" placeholder="45 Minutes" />
          <button className="bg-blue-700 text-white px-12 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">
            Apply
          </button>
        </div>

        <ExamSection
          title="Live Exams"
          exams={liveExams}
          type="LIVE EXAM"
          badgeColor="bg-[#EF5350]"
        />
        <ExamSection
          title="Upcoming Exams"
          exams={upcomingExams}
          type="UPCOMING EXAM"
          badgeColor="bg-[#F59E0B]"
        />
        <ExamSection
          title="Offline Exams"
          exams={offlineExams}
          type="OFFLINE EXAM"
          badgeColor="bg-[#ffffff]"
        />
      </div>
    </section>
  );
};

export default ExamsChart;
