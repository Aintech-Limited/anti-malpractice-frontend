import { AssignedLecturerStatusEnum, LecturerROleEnum } from "@/src/lib/enums";

export const roleOptions = [
  {
    value: LecturerROleEnum.MAIN_LECTURER,
    label: "Main Lecturer",
    description: "Primary responsible lecturer",
    color: "bg-red-100 text-red-800",
  },
  {
    value: LecturerROleEnum.ASSISTING_LECTURER,
    label: "Assisting Lecturer",
    description: "Supports main lecturer",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: LecturerROleEnum.GUEST_LECTURER,
    label: "Guest Lecturer",
    description: "For specific sessions",
    color: "bg-green-100 text-green-800",
  },
  {
    value: LecturerROleEnum.TEACHING_ASSISTANT,
    label: "Teaching Assistant",
    description: "Assists with grading and tutorials",
    color: "bg-purple-100 text-purple-800",
  },
];

export const statusOptions = [
  {
    value: AssignedLecturerStatusEnum.ACTIVE,
    label: "Active",
    color: "bg-green-100 text-green-800",
  },
  {
    value: AssignedLecturerStatusEnum.INACTIVE,
    label: "Inactive",
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: AssignedLecturerStatusEnum.PENDING,
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: AssignedLecturerStatusEnum.COMPLETED,
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
  },
];

export const manageAssignmentRoleColors = {
  MAIN_LECTURER: "bg-red-100 text-red-800",
  ASSISTING_LECTURER: "bg-blue-100 text-blue-800",
  GUEST_LECTURER: "bg-green-100 text-green-800",
  TEACHING_ASSISTANT: "bg-purple-100 text-purple-800",
};

export const manageAssignmentStatusColors = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-blue-100 text-blue-800",
};
