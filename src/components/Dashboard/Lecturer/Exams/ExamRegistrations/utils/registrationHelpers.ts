import { formatDate } from "@/src/lib/helper";
import { IExamRegistration } from "../interface";
import { REGISTRATION_STATUS } from "./registrationConstants";

export const getRegistrationStatus = (status: string) => {
  return (
    REGISTRATION_STATUS[status as keyof typeof REGISTRATION_STATUS] ||
    REGISTRATION_STATUS.REGISTERED
  );
};

export const getStudentFullName = (registration: IExamRegistration): string => {
  return `${registration.student.firstName} ${registration.student.lastName}`;
};

export const exportToCSV = (
  registrations: IExamRegistration[],
  examTitle: string,
) => {
  const headers = [
    "Student Name",
    "Level",
    "Semester",
    "Registration Date",
    "Status",
    "Course Code",
    "Department",
  ];

  const rows = registrations.map((reg) => [
    getStudentFullName(reg),
    reg.level,
    reg.semester,
    formatDate(reg.registeredAt).replaceAll(",", "-"),
    reg.registrationStatus,
    reg.course.courseCode,
    reg.course.department?.name || "N/A",
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${examTitle}_registrations.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const calculateStatistics = (registrations: IExamRegistration[]) => {
  const total = registrations.length;
  const byLevel: Record<number, number> = {};
  const byStatus: Record<string, number> = {};

  registrations.forEach((reg) => {
    byLevel[reg.level] = (byLevel[reg.level] || 0) + 1;
    byStatus[reg.registrationStatus] =
      (byStatus[reg.registrationStatus] || 0) + 1;
  });

  return {
    total,
    byLevel,
    byStatus,
  };
};
