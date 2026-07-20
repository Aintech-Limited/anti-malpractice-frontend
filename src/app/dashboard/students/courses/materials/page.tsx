import CourseMaterialsPage from "@/src/components/Dashboard/Student/CourseMaterial/CourseMaterial";
import { ICourseMaterialsProps } from "@/src/components/Dashboard/Student/CourseMaterial/interface";

export default async function CourseMaterialPage({
  searchParams,
}: ICourseMaterialsProps) {
  const { limit, page, sort, stats } = await searchParams;
  return (
    <CourseMaterialsPage limit={limit} page={page} sort={sort} stats={stats} />
  );
}
