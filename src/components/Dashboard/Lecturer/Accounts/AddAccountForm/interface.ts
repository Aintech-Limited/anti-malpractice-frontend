import { IBank, IFormData } from "../interface";

export interface IAddAccountFormProps {
  banks: IBank[];
  accountsCount: number;
  maxAccounts: number;
  loading: boolean;
  verifyingAccount: boolean;
  formData: IFormData;
  onFormChange: (data: Partial<IFormData>) => void;
  onVerifyAccount: () => Promise<void>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}
