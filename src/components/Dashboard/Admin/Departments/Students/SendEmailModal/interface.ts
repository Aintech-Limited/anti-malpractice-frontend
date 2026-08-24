import { TEmailTemplateEnum } from "@/src/lib/enums";

export interface ISendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    emailType: TEmailTemplateEnum,
    customMessage?: string,
  ) => Promise<void>;
  studentName: string;
  studentEmail: string;
}
