import Earnings from "@/src/components/Dashboard/Admin/Earnings/Earnings";
import { getAdminEarnings } from "@/src/lib/serverHelper";

export default async function EarningsPage() {
  const initialData = await getAdminEarnings();
  return <Earnings initialData={initialData} />;
}
