import { Dispatch, RefObject, SetStateAction } from "react";

export interface ICaptureCameraProps {
  cameraPermission: "granted" | "denied" | "pending";
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cameraDevices: MediaDeviceInfo[];
  selectedCamera: string;
  capturedImage: string | null;
  captureQuality: number;
  submitEnrollment: () => Promise<void>;
  isLoading: boolean;
  retryCapture: () => void;
  captureImage: () => void;
  setSelectedCamera: Dispatch<SetStateAction<string>>;
}
