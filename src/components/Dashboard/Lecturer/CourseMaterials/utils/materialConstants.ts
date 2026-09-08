export const FILE_TYPES = {
  PDF: {
    label: "PDF Document",
    color: "bg-red-100 text-red-800",
    icon: "FileText",
  },
  VIDEO: { label: "Video", color: "bg-blue-100 text-blue-800", icon: "Video" },
  DOCUMENT: {
    label: "Document",
    color: "bg-green-100 text-green-800",
    icon: "File",
  },
} as const;

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
  { value: "title", label: "Title" },
  { value: "price", label: "Price" },
  { value: "downloadCount", label: "Downloads" },
  { value: "averageRating", label: "Rating" },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: "ASC", label: "Ascending" },
  { value: "DESC", label: "Descending" },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const FILE_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "PDF", label: "PDF" },
  // { value: "VIDEO", label: "Video" },
  // { value: "DOCUMENT", label: "Document" },
] as const;

export const PRICE_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Free" },
  { value: "false", label: "Paid" },
] as const;
