import { TKycStatusEnum } from "@/src/lib/enums";
import { ILecturer } from "../interface";

export interface IReviewDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecturer: ILecturer | null;
  onVerify: (
    lecturerId: string,
    type: "id" | "selfie",
    status: TKycStatusEnum,
  ) => Promise<void>;
}
