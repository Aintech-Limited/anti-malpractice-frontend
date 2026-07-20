import { FileText, BookOpen, Package } from "lucide-react";

export const MERCHANDISE_CONFIG = {
  EXAM_REGISTRATION: {
    icon: FileText,
    iconColor: "text-purple-600",
    bgColor: "from-purple-50 to-purple-100",
    label: "Exam Registration",
  },
  COURSE_MATERIAL: {
    icon: BookOpen,
    iconColor: "text-blue-600",
    bgColor: "from-blue-50 to-blue-100",
    label: "Course Material",
  },
  default: {
    icon: Package,
    iconColor: "text-gray-600",
    bgColor: "from-gray-50 to-gray-100",
    label: "Unknown",
  },
} as const;

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export const PAYMENT_STATUS = {
  SUCCESS: {
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200",
  },
  PENDING: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200",
  },
  FAILED: {
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-200",
  },
} as const;
