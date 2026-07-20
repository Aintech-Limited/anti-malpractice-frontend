import { IPayment } from "../interface";
import { MERCHANDISE_CONFIG, PAYMENT_STATUS } from "./paymentConstants";

export const getMerchandiseIcon = (type: string) => {
  const config =
    MERCHANDISE_CONFIG[type as keyof typeof MERCHANDISE_CONFIG] ||
    MERCHANDISE_CONFIG.default;
  return config.icon;
};

export const getMerchandiseStyles = (type: string) => {
  const config =
    MERCHANDISE_CONFIG[type as keyof typeof MERCHANDISE_CONFIG] ||
    MERCHANDISE_CONFIG.default;
  return {
    iconColor: config.iconColor,
    bgGradient: `bg-gradient-to-br ${config.bgColor}`,
  };
};

export const getStatusColor = (status: string) => {
  const statusKey = status as keyof typeof PAYMENT_STATUS;
  const config = PAYMENT_STATUS[statusKey] || PAYMENT_STATUS.PENDING;
  return `${config.bgColor} ${config.textColor} ${config.borderColor}`;
};

export const calculateTotalAmount = (payments: IPayment[]): number => {
  return payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
};

export const formatTransactionId = (id?: string): string => {
  if (!id) return "N/A";
  return `${id.slice(0, 8)}...`;
};

export const getCourseFromPayment = (payment: IPayment) => {
  if (payment.courseMaterial?.course) {
    return payment.courseMaterial.course;
  }
  if (payment.examRegistration?.course) {
    return payment.examRegistration.course;
  }
  return null;
};

export const getMerchandiseTitle = (payment: IPayment): string => {
  if (payment.merchandiseName === "COURSE_MATERIAL") {
    return payment.courseMaterial?.title || "Course Material";
  }
  return "Exam Registration";
};

export const getCourseSubtitle = (payment: IPayment): string | null => {
  if (payment.merchandiseName === "COURSE_MATERIAL" && payment.courseMaterial) {
    return `Course: ${payment.courseMaterial.course.title}`;
  }
  return null;
};
