import { ICourseMaterial, IUploadResponse } from "../interface";
import { FILE_TYPES } from "./materialConstants";

export const getFileTypeConfig = (fileType: string) => {
  return FILE_TYPES[fileType as keyof typeof FILE_TYPES] || FILE_TYPES.PDF;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatPrice = (
  price: string | number,
  isFree: boolean,
): string => {
  if (isFree) return "Free";
  if (!price) return `₦0`;
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `₦${numPrice.toLocaleString()}`;
};

export const calculateTotalSize = (materials: ICourseMaterial[]): string => {
  const totalBytes = materials.reduce((sum, m) => sum + (m.fileSize || 0), 0);
  return formatFileSize(totalBytes);
};

export const calculateAverageRating = (
  materials: ICourseMaterial[],
): number => {
  if (!materials) return 0;
  const totalRating = materials.reduce(
    (sum, m) => sum + m.averageRating * m.ratingCount,
    0,
  );
  const totalCount = materials.reduce((sum, m) => sum + m.ratingCount, 0);
  return totalCount === 0 ? 0 : totalRating / totalCount;
};

export const getMaterialStats = (materials: ICourseMaterial[]) => {
  if (!materials) {
    return {
      total: 0,
      freeCount: 0,
      paidCount: 0,
      totalDownloads: 0,
      totalRevenue: 0,
    };
  }
  const total = materials.length;
  const freeCount = materials.filter((m) => m.isFree).length;
  const paidCount = total - freeCount;
  const totalDownloads = materials.reduce((sum, m) => sum + m.downloadCount, 0);
  const totalRevenue = materials
    .filter((m) => !m.isFree)
    .reduce((sum, m) => sum + parseFloat(m.price) * m.downloadCount, 0);

  return {
    total,
    freeCount,
    paidCount,
    totalDownloads,
    totalRevenue,
  };
};

export const uploadCoverImage = async (
  file: File,
): Promise<IUploadResponse> => {
  const formData = new FormData();
  formData.append("cover", file);

  const response = await fetch("/api/v1/uploads/materials/cover", {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export const uploadMaterialFile = async (
  file: File,
): Promise<IUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/v1/uploads/materials/file", {
    method: "POST",
    body: formData,
  });

  return response.json();
};
