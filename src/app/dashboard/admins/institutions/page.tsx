import InstitutionsClient from "@/src/components/Dashboard/Admin/Institutions/Institution";

import { InstitutionLevelEnum } from "@/src/lib/enums";
import { getInitialInstitutions } from "@/src/lib/serverHelper";

export default async function InstitutionPage() {
  const params = new URLSearchParams({
    page: "1",
    limit: "10",
    includeDetails: "true",
    includeDepartments: "true",
    institutionLevel: InstitutionLevelEnum.TERTIARY,
  });
  const initialData = await getInitialInstitutions(params);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <InstitutionsClient
          initialInstitutions={initialData.data || []}
          initialMeta={initialData.meta!}
        />
      </div>
    </div>
  );
}
