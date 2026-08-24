import { IActionModalState } from "../interface";

export interface IWarningDialogProps {
  modal: IActionModalState;
  closeModal: () => void;
  actionLoading: boolean;
  executeAction: () => Promise<void>;
}
