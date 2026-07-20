import { SetStateAction } from "react";
import { IStudent, TActionType } from "../interface";

export interface IModalWrapperProps {
  onSetModalState: (
    value: SetStateAction<{
      type: TActionType;
      student: IStudent | null;
    }>,
  ) => void;
  modalState: {
    type: TActionType;
    student: IStudent | null;
  };
  handleSuspend: (
    student: IStudent,
    action: "suspend" | "unsuspend",
    reason?: string,
  ) => Promise<void>;
}
