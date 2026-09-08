import { IExam } from "../interface";
import { EXAM_STATUS } from "./examConstants";

export const getExamStatus = (status: string) => {
  return (
    EXAM_STATUS[status as keyof typeof EXAM_STATUS] || EXAM_STATUS.UPCOMING
  );
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatFee = (fee: number): string => {
  return `₦${fee.toLocaleString()}`;
};

export const isRegistrationOpen = (exam: IExam): boolean => {
  const deadline = new Date(exam.registrationDeadline);
  const today = new Date();
  return exam.status === "UPCOMING" && deadline >= today && !exam.isRegistered;
};

export const canRegister = (exam: IExam): boolean => {
  return exam.status === "UPCOMING" && !exam.isRegistered;
};

export const getButtonText = (exam: IExam): string => {
  if (exam.isRegistered) return "Registered";
  if (exam.examRegistrationId && !exam.isRegistered) return "Proceed to Pay";
  if (exam.status === "ENDED") return "Closed";
  return "Register";
};

export const isButtonDisabled = (exam: IExam): boolean => {
  return exam.isRegistered || exam.status === "ENDED";
};

export const getInitials = (user: any) => {
  const first = user?.firstName?.trim()?.[0] ?? "";
  const last = user?.lastName?.trim()?.[0] ?? "";

  return `${first}${last}`.toUpperCase() || "U";
};
