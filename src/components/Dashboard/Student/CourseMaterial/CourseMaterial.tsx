import StatCard from "./StatCard/StatCard";
import MaterialCard from "./MaterialCard/MaterialCard";
import { courseStats } from "./data";
import { getPurchasedCourseMaterials } from "@/src/lib/serverHelper";
import { ICourseMaterialsQuery } from "./interface";
import { EmptyState } from "@/src/components/common/EmptyState/EmptyState";

const CourseMaterials = async ({
  limit,
  page,
  sort,
  stats,
}: ICourseMaterialsQuery) => {
  const courseData = await getPurchasedCourseMaterials({
    limit,
    page,
    sort,
    stats,
  });
  // console.log('courseData: ', JSON.stringify(courseData));
  return (
    <div className="max-w-7xl mx-auto space-y-10 p-20">
      <header>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          eBook Purchase Collections
        </h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courseStats?.map((stat) => {
          const count =
            stat.id === "total"
              ? (courseData?.data?.stats?.total ?? 0)
              : stat.id === "completed"
                ? (courseData?.data?.stats?.completed ?? 0)
                : stat.id === "wishlist"
                  ? (courseData?.data?.stats?.wishlist ?? 0)
                  : (courseData?.data?.stats?.inProgress ?? 0);
          const updatedStat = { ...stat, count };
          return <StatCard key={stat.id} {...updatedStat} />;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {courseData?.data?.materials?.map((material, idx) => (
          <MaterialCard key={idx} material={material} />
        ))}
      </div>
      {!courseData?.data?.materials?.length && (
        <EmptyState title="No purchased Material" />
      )}
    </div>
  );
};

export default CourseMaterials;
