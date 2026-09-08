import { IPaymentsPageProps } from "@/src/components/Dashboard/Student/Payments/interface";
import { Suspense } from "react";
import { fetchPayments } from "@/src/lib/serverHelper";
import PaymentsSkeleton from "@/src/components/Dashboard/Student/Payments/PaymentsSkeleton/PaymentsSkeleton";
import Payment from "@/src/components/Dashboard/Student/Payments/Payment";
import {
  validateSearchParamsLimit,
  validateSearchParamsPage,
  validateSearchParamsSortBy,
} from "@/src/lib/utils/validateSearchParams";

export default async function VendorPaymentsViewPage({
  searchParams,
}: IPaymentsPageProps) {
  const data = await fetchPayments(searchParams);
  const { limit, page, sortBy, type } = await searchParams;

  return (
    <Suspense fallback={<PaymentsSkeleton />}>
      <Payment
        initialData={data}
        initialFilters={{
          type: type || "",
          sortBy: validateSearchParamsSortBy(sortBy),
          page: validateSearchParamsPage(page),
          limit: validateSearchParamsLimit(limit, 50),
        }}
      />
    </Suspense>
  );
}
