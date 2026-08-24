export interface IBank {
  id: number;
  code: string;
  name: string;
}

export interface IAccount {
  id: string;
  userId: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  createdAt: string;
  isDefault: boolean;
}

export interface IAccountsResponse {
  success: boolean;
  message: string;
  data: {
    hasPIN: boolean;
    accounts: IAccount[];
  };
}

export interface IAccountsProps {
  initialAccounts: IAccount[];
  hasPIN: boolean;
  banks: IBank[];
}

export interface INotification {
  type: "success" | "error";
  message: string;
}

export interface IFormData {
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountName: string;
  pin: string[];
}
