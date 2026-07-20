import { EmailTemplateEnum, TEmailTemplateEnum } from "@/src/lib/enums";

export const emailTemplates: {
  value: TEmailTemplateEnum;
  label: string;
  description: string;
}[] = [
  {
    value: EmailTemplateEnum.BLOCK_NOTIFICATION,
    label: "Block Notification",
    description: "Notify student about account block",
  },
  {
    value: EmailTemplateEnum.UNBLOCK_NOTIFICATION,
    label: "Unblock Notification",
    description: "Notify student about account unblock",
  },
];
