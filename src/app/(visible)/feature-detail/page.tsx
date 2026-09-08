import FeatureDetail from "@/src/components/FeatureDetail/FeatureDetail";
import { redirect } from "next/navigation";

export default async function FeatureDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  if (!["student", "lecturer"].includes(q ?? "")) {
    redirect("/#howitworks");
  }
  return <FeatureDetail query={q as "student" | "lecturer"} />;
}
