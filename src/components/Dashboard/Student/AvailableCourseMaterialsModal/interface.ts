export interface IAvailableCourseMaterial {
  id: string;
  title: string;
  description?: string;
  fileType: "pdf" | "video" | "document" | "image" | "other";
  fileURL: string;
  MaterialCover?: string;
  size?: string;
  duration?: string;
  price?: number;
  isPurchased: boolean;
  courseCode: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  averageRating?: number;
}

export interface IAvailableCourseMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  onPurchaseComplete?: () => void;
}

export interface ICOurseMaterialPurchaseInitiateResponse {
  message: string;
  success: boolean;
  data: {
    link: string; // 'https://paymentlink.pay';
    transactionRef: string; // '09823234-2323-e443-45e3-43wertg56789';
    provider: string; // 'FLUTTERWAVE';
  };
}
