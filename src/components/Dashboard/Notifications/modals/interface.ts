import { INotification } from "../interface";

export interface INotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: INotification | null;
}
