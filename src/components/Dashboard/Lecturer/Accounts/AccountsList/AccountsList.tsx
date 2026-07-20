"use client";

import { IAccountsListProps } from "./interface";
import AccountCard from "../AccountCard/AccountCard";
import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";

export default function AccountsList({
  accounts,
  onDeleteAccount,
  onSetDefault,
}: IAccountsListProps) {
  if (accounts.length === 0) {
    return (
      <EmptyState
        title="No bank accounts linked"
        description="Link your bank account to make payments and receive refunds securely."
        icon="credit-card"
        action={{
          label: "Add Bank Account Using The Form",
          onClick: () => {},
          variant: "primary",
        }}
        size="md"
      />
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onDelete={onDeleteAccount}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
