import { Suspense } from "react";
import AccountsSkeleton from "@/src/components/Dashboard/Lecturer/Accounts/AccountsSkeleton/AccountsSkeleton";
import { fetchAccounts, fetchBankList } from "@/src/lib/serverHelper";
import Accounts from "@/src/components/Dashboard/Lecturer/Accounts/Accounts";

export default async function AccountsPage() {
  const accountsData = await fetchAccounts();
  const banksData = await fetchBankList();

  return (
    <Suspense fallback={<AccountsSkeleton />}>
      <Accounts
        initialAccounts={accountsData.data.accounts}
        hasPIN={accountsData.data.hasPIN}
        banks={banksData.data}
      />
    </Suspense>
  );
}
