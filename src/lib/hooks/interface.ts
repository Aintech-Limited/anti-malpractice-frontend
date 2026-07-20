import { TViolationType } from "../proctoring/interface";

export interface IWSViolationData {
  type: TViolationType;
  severity: number;
  timestamp: number;
  metadata: Record<string, any>;
}
