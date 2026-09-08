export const UserRoleTypeEnum = Object.freeze({
  STUDENT: "STUDENT",
  LECTURER: "LECTURER",
  VENDOR: "VENDOR",
  ADMIN: "ADMIN",
});

export type UserRoleTypeEnumKey = keyof typeof UserRoleTypeEnum;
export type UserRoleTypeEnumValue =
  (typeof UserRoleTypeEnum)[keyof typeof UserRoleTypeEnum];

export const SexTypeEnum = Object.freeze({
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
});

export type SexTypeEnumKey = keyof typeof SexTypeEnum;
export type SexTypeEnumValue = (typeof SexTypeEnum)[keyof typeof SexTypeEnum];

export const PhotoIdType = Object.freeze({
  DRIVER_LICENSE: "DRIVER_LICENSE",
  NATIONAL_ID_CARD: "NATIONAL_ID_CARD",
  INTERNATIONAL_PASSWORT: "INTERNATIONAL_PASSWORT",
});

export type PhotoIdTypeKey = keyof typeof PhotoIdType;
export type PhotoIdTypeValue = (typeof PhotoIdType)[keyof typeof PhotoIdType];

export const ProtectedRouteEnum = Object.freeze({
  DASHBOARD: "/dashboard",
  DASHBOARD_LECTURERS_VERIFY: "/dashboard/lecturers/verify",
  STUDENTS: "/dashboard/students",
  LECTURERS: "/dashboard/lecturers",
  VENDORS: "/dashboard/vendors",
  ADMINS: "/dashboard/admins",
  CHECKOUT: "/checkout",
  STUDENT_FACE_CAPTURE: "/dashboard/students/face-capture",
});

export type ProtectedRouteEnumValue =
  (typeof ProtectedRouteEnum)[keyof typeof ProtectedRouteEnum];

export const UnProtectedRouteEnum = Object.freeze({
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  VERIFY: "/verify",
  FORGOT_PASSWORD: "/forgot-password",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  SUPPORT: "/support",
  HOME: "/",
});

export type UnProtectedRouteEnumValue =
  (typeof UnProtectedRouteEnum)[keyof typeof UnProtectedRouteEnum];

export const KYC_FRONT = "front";
export const KYC_BACK = "back";
export const KYC_SELFIE = "selfie";

export const ExamStageEnum = Object.freeze({
  SMQ: "SMQ",
  SHORT: "SHORT",
  SUBMITTED: "SUBMITTED",
});

export type ExamStageEnumKey = keyof typeof ExamStageEnum;
export type ExamStageEnumValue =
  (typeof ExamStageEnum)[keyof typeof ExamStageEnum];

export const ExamQuestionTypeEnum = Object.freeze({
  MCQ: "MCQ",
  SHORT: "SHORT",
});

export type ExamQuestionTypeEnumKey = keyof typeof ExamQuestionTypeEnum;
export type ExamQuestionTypeEnumValue =
  (typeof ExamQuestionTypeEnum)[keyof typeof ExamQuestionTypeEnum];

export const DBExamAnswerSyncEnum = Object.freeze({
  PENDING: "pending",
  SYNCING: "syncing",
  SYNCED: "synced",
  FAILED: "failed",
});
export type TDBExamAnswerSyncType =
  (typeof DBExamAnswerSyncEnum)[keyof typeof DBExamAnswerSyncEnum];

export const DepartmentStudentSortEnum = Object.freeze({
  ALL: "ALL",
  BLOCKED: "BLOCKED",
  ACTIVE: "ACTIVE",
  FACEAUTHENABLED: "FACEAUTHENABLED",
});
export type TDepartmentStudentSortEnumValue =
  (typeof DepartmentStudentSortEnum)[keyof typeof DepartmentStudentSortEnum];

export const LecturerROleEnum = Object.freeze({
  TEACHING_ASSISTANT: "TEACHING_ASSISTANT",
  GUEST_LECTURER: "GUEST_LECTURER",
  ASSISTING_LECTURER: "ASSISTING_LECTURER",
  MAIN_LECTURER: "MAIN_LECTURER",
});
export type TLecturerROleEnumValue =
  (typeof LecturerROleEnum)[keyof typeof LecturerROleEnum];

export const AssignedLecturerStatusEnum = Object.freeze({
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  COMPLETED: "COMPLETED",
});
export type TAssignedLecturerStatusEnumValue =
  (typeof AssignedLecturerStatusEnum)[keyof typeof AssignedLecturerStatusEnum];

export const AdminExamReviewStatus = Object.freeze({
  NOT_APPROVED: "NOT_APPROVED",
  APPROVED: "APPROVED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
});
export type TAdminExamStatusValue =
  (typeof AdminExamReviewStatus)[keyof typeof AdminExamReviewStatus];

export const AdminExamTypeEnum = Object.freeze({
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  MOCK: "MOCK",
});
export type TAdminExamTypeEnumValue =
  (typeof AdminExamTypeEnum)[keyof typeof AdminExamTypeEnum];

export const EmailTemplateEnum = Object.freeze({
  BLOCK_NOTIFICATION: "block-notification",
  UNBLOCK_NOTIFICATION: "unblock-notification",
});
export type TEmailTemplateEnum =
  (typeof EmailTemplateEnum)[keyof typeof EmailTemplateEnum];

export const CourseStatusEnum = Object.freeze({
  ACTIVE: "ACTIVE",
  ONGOING: "ONGOING",
  INACTIVE: "INACTIVE",
  ENDED: "ENDED",
});
export type TCourseStatusEnum =
  (typeof CourseStatusEnum)[keyof typeof CourseStatusEnum];

export const KycStatusEnum = Object.freeze({
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
});
export type TKycStatusEnum = (typeof KycStatusEnum)[keyof typeof KycStatusEnum];

export const ResultStatusEnum = Object.freeze({
  PENDING: "PENDING",
  GRADED: "GRADED",
  RELEASED: "RELEASED",
});
export type TResultStatusEnum =
  (typeof ResultStatusEnum)[keyof typeof ResultStatusEnum];

export const NotificationTypeEnum = Object.freeze({
  INFO: "INFO",
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
  EXAM: "EXAM",
  GRADE: "GRADE",
  PURCHASE: "PURCHASE",
});
export type TNotificationTypeEnum =
  (typeof NotificationTypeEnum)[keyof typeof NotificationTypeEnum];

export const DepartmentUserRoleEnum = {
  HEAD: "HEAD",
  DEPUTY_HEAD: "DEPUTY_HEAD",
  COORDINATOR: "COORDINATOR",
  LECTURER: "LECTURER",
  ASSISTANT: "ASSISTANT",
  STAFF: "STAFF",
  STUDENT: "STUDENT",
};
export type TDepartmentUserRoleEnum =
  (typeof DepartmentUserRoleEnum)[keyof typeof DepartmentUserRoleEnum];

export const ComplaintCategoryEnum = {
  INFRASTRUCTURE: "INFRASTRUCTURE",
  UTILITY: "UTILITY",
  SANITATION: "SANITATION",
  SECURITY: "SECURITY",
  VIOLENCE: "VIOLENCE",
  SEXUAL_ASSULT: "SEXUAL_ASSULT",
  OTHERS: "OTHERS",
};
export type TComplaintCategoryEnum =
  (typeof ComplaintCategoryEnum)[keyof typeof ComplaintCategoryEnum];

export const ComplaintStatusEnum = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
};
export type TComplaintStatusEnum =
  (typeof ComplaintStatusEnum)[keyof typeof ComplaintStatusEnum];

export const ComplaintPriorityEnum = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};
export type TComplaintPriorityEnum =
  (typeof ComplaintPriorityEnum)[keyof typeof ComplaintPriorityEnum];

export const InstitutionLevelEnum = Object.freeze({
  TERTIARY: "TERTIARY",
  SECONDARY: "SECONDARY",
  PRIMARY: "PRIMARY",
});

export type TInstitutionLevelEnum =
  (typeof InstitutionLevelEnum)[keyof typeof InstitutionLevelEnum];

export const AdminExamStatusTypeEnum = Object.freeze({
  NOT_APPROVED: "NOT_APPROVED",
  APPROVED: "APPROVED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
} as const);

export type TAdminExamStatusTypeEnumValue =
  (typeof AdminExamStatusTypeEnum)[keyof typeof AdminExamStatusTypeEnum];
