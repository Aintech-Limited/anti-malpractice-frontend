export interface IAddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    description: string;
    activeSemester: number | string;
    imageUrl?: string;
  }) => Promise<void>;
}
