"use client";

import { Plus } from "lucide-react";
import {
  ILecturerDashboardProps,
  ILecturerExamStats,
  ILecturerNotification,
} from "./interface";
import { formatDate } from "@/src/lib/helper";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { useRouter } from "next/navigation";
import ActionCard from "./DashboardCards/ActionCard";
import StatCard from "./DashboardCards/StatCard";
import NotificationItemCard from "./DashboardCards/NotificationItemCard";
import { toast } from "react-toastify";

const LecturerDashboard = ({ initialData }: ILecturerDashboardProps) => {
  const router = useRouter();
  const [notifications, _setNotifications] = useState<ILecturerNotification[]>(
    initialData?.data?.recentNotifications ?? [],
  );
  const [stats, _setStats] = useState<ILecturerExamStats>(
    initialData?.data?.stats ?? {},
  );

  if (!initialData.success) {
    toast.error(initialData?.message ?? "Error occured");
  }

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans w-full overflow-x-hidden">
      <main className="flex-1 w-full min-w-0 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="mb-8 sm:mb-10 w-full min-w-0">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Notification
            </h2>
            {/* <button className="text-blue-600 text-sm font-bold hover:underline">
              See All
            </button> */}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full min-w-0">
            {notifications.map((notification, idx) => {
              return (
                <NotificationItemCard
                  key={notification.id}
                  title={notification.title}
                  time={formatDistanceToNow(notification.createdAt, {
                    addSuffix: true,
                  })}
                  date={formatDate(notification.createdAt)}
                  border={idx < 2}
                  type={notification.type}
                  message={notification.message}
                />
              );
            })}
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Exam Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 w-full min-w-0">
          <StatCard label="Total Exams" value={stats.totalExams} />

          <StatCard
            label="Completed Exams"
            value={stats.completedExams}
            color="text-green-500"
          />
          <StatCard label="Needs Approval" value={stats.needsApproval} />
          {/* <StatCard label="Draft Exams" value="12" /> */}
          <StatCard
            label="Live Exam"
            value={stats.liveExams}
            color="text-red-500"
          />
          <StatCard label="Upcoming Exams" value={stats.upcomingExams} />
          {/* <StatCard label="Practice Exams" value="13" /> */}
          <ActionCard
            label="Create a new exam"
            icon={
              <Plus
                onClick={() =>
                  router.push(ProtectedRouteEnum.LECTURERS + "/exams")
                }
              />
            }
          />
        </div>
      </main>
    </div>
  );
};

export default LecturerDashboard;
