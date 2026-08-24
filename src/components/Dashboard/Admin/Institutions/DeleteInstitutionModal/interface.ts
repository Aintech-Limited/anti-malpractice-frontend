export interface IDeleteInstitutionModalProps {
  isOpen: boolean;
  institutionId: string;
  institutionName: string;
  onClose: () => void;
  onSuccess: () => void;
}
