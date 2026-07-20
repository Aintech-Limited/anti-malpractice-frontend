import { IExam } from "../interface";
import { EXAM_STATUS, EXAM_TYPES } from "./examConstants";

export const getExamStatus = (status: string) => {
  return (
    EXAM_STATUS[status as keyof typeof EXAM_STATUS] || EXAM_STATUS.UPCOMING
  );
};

export const getExamType = (type: string) => {
  return EXAM_TYPES[type as keyof typeof EXAM_TYPES] || EXAM_TYPES.ONLINE;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} mins`;
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours}h ${mins}m`;
};

export const canDeleteExam = (exam: IExam): boolean => {
  const startDate = new Date(exam.startTime);
  const now = new Date();
  const daysUntilStart = Math.ceil(
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  return daysUntilStart > 7;
};

export const getDaysUntilStart = (exam: IExam): number => {
  const startDate = new Date(exam.startTime);
  const now = new Date();
  return Math.ceil(
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
};

export const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "MCQ":
      return "bg-purple-100 text-purple-700";
    case "TRUE_FALSE":
      return "bg-indigo-100 text-indigo-700";
    case "FILL_BLANK":
      return "bg-pink-100 text-pink-700";
    case "SHORT":
      return "bg-blue-100 text-blue-700";
    case "ESSAY":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
