import { BackupCode, EnrollmentStep } from "../interface";

export interface ISUccessProps {
  step?: EnrollmentStep;
  successMessage: string | null;
  backupCodes: BackupCode[];
  downloadBackupCodes: () => void;
  copyBackupCodes: () => Promise<void>;
  onEnrollmentComplete:
    | ((data: {
        success: boolean;
        backupCodes?: string[];
        message: string;
      }) => void)
    | undefined;
  isVerification: boolean;
}
