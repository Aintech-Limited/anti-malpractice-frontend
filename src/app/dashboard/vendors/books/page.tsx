import { ICourseMaterialsPageProps } from "@/src/components/Dashboard/Lecturer/CourseMaterials/interface";
import BooksClient from "@/src/components/Dashboard/Vendors/Books/Books";
import { normaliseCourseMaterialsParams } from "@/src/lib/helper";
import { getInitialVendorBooks } from "@/src/lib/serverHelper";

export default async function VendorBooksPage({
  searchParams,
}: ICourseMaterialsPageProps) {
  const params = await searchParams;
  const result = await getInitialVendorBooks(
    normaliseCourseMaterialsParams(params) as any,
  );
  return (
    <BooksClient
      initialBooks={{
        books: result.data?.materials,
        totalRevenue: result.data?.totalRevenue,
      }}
      initialMeta={result.meta}
      initialFilters={{
        ...params,
        page: Number(params.page ?? "1"),
        limit: Number(params.limit ?? "10"),
        sortBy: params?.sortBy ?? "createdAt",
        sortOrder: params.sortOrder ?? "DESC",
        fileType: params.fileType ?? "",
        isFree: params?.isFree ?? "",
        search: params.search ?? "",
      }}
    />
  );
}
