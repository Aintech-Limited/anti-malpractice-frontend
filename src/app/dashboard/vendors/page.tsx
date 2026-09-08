import VendorsDashboard from "@/src/components/Dashboard/Vendors/Dashboard/VendorsDashboard";
import { getVendorDashboard } from "@/src/lib/serverHelper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Vendor | FINDU Dashboard`,
  description: "Dashboard.",
};

export default async function VendorsPage() {
  const data = await getVendorDashboard();
  return <VendorsDashboard initialData={data} />;
}
