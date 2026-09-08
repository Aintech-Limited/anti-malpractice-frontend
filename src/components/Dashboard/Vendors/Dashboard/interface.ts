export type TMonth =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "July"
  | "Aug"
  | "Sept"
  | "Nov"
  | "Dec";
export interface IVendorsDashboardProps {
  initialData: {
    message: string;
    success: boolean;
    data: {
      stats: { booksAdded: number; booksApproved: number; booksSold: number };
      barchart: { label: TMonth; value: number }[];
      lastestPurchase: {
        id: string;
        student?: { firstName: string; lastName: string };
        amount: string;
        currency: string;
        createdAt: string;
        updatedAt: string;
      }[]; // 5 is limit for this
    };
  };
}
