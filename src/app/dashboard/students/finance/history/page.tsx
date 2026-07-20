import { IPaymentsPageProps } from "@/src/components/Dashboard/Student/Payments/interface";
import { fetchPayments } from "@/src/lib/serverHelper";
import Payment from "@/src/components/Dashboard/Student/Payments/Payment";

export default async function PaymentsPage({
  searchParams,
}: IPaymentsPageProps) {
  const data = await fetchPayments(searchParams);

  const {
    limit = "50",
    page = "1",
    sortBy = "createdAt",
    type = "",
  } = await searchParams;

  return (
    <Payment
      initialData={data}
      initialFilters={{
        type,
        sortBy,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      }}
    />
  );
}
