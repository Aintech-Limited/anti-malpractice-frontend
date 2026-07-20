import {
  TAdminExamStatusValue,
  TAdminExamTypeEnumValue,
} from "@/src/lib/enums";

export const adminExamCardTypeColors: Record<TAdminExamTypeEnumValue, string> =
  {
    ONLINE: "bg-blue-100 text-blue-800",
    OFFLINE: "bg-purple-100 text-purple-800",
    MOCK: "bg-orange-100 text-orange-800",
  };

export const adminExamCardstatusColors: Record<
  TAdminExamStatusValue,
  { bg: string; text: string; id: number }
> = {
  APPROVED: {
    bg: "bg-green-100",
    text: "text-green-800",
    id: 1,
  },
  NOT_APPROVED: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    id: 2,
  },
  CHANGES_REQUESTED: {
    bg: "bg-red-100",
    text: "text-red-800",

    id: 3,
  },
};
