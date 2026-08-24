import Link from "next/link";
import { ReactNode } from "react";

function MobileSubItem({
  icon,
  label,
  href,
}: {
  icon: ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-slate-600 active:text-blue-600 py-1"
    >
      <span className="text-slate-400">{icon}</span>
      <span className="text-base font-medium">{label}</span>
    </Link>
  );
}

export default MobileSubItem;
