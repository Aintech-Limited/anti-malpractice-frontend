import { EnrollmentStep } from "./interface";

export const enrollmentSteps: EnrollmentStep[] = [
  {
    id: "instructions",
    title: "Face Authentication Setup",
    description:
      "We'll capture your face to enable secure login. Make sure you have good lighting and face the camera directly.",
  },
  {
    id: "camera",
    title: "Camera Setup",
    description: "Allow camera access and position your face in the frame.",
  },
  {
    id: "capture",
    title: "Capture Your Face",
    description: "Hold still while we capture your face image.",
  },
  {
    id: "processing",
    title: "Processing",
    description: "We're analyzing your face and creating a secure template.",
  },
  {
    id: "success",
    title: "Capture Successful",
    description: "Your face capture was successfull.",
  },
  {
    id: "error",
    title: "Capture Failed",
    description: "There was an error capturing up face.",
  },
];
