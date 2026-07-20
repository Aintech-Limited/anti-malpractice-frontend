import CourseCatalog from "@/src/components/Dashboard/Student/CoursesCatalog/CoursesCatalog";
import { ICoursesCatalogQueryParams } from "@/src/components/Dashboard/Student/CoursesCatalog/interface";
import { getCourses } from "@/src/lib/serverHelper";

const CoursesCatalogPage = async ({
  searchParams,
}: ICoursesCatalogQueryParams) => {
  const { limit, page, sortBy, sortOrder, status, search, searchCode } =
    await searchParams;
  const data = await getCourses({
    limit: limit || 20,
    page: page || 1,
    search,
    searchCode,
    sortBy,
    sortOrder,
    status,
  });

  return <CourseCatalog departments={data.data} activeSemester={1} />;
};

export default CoursesCatalogPage;
