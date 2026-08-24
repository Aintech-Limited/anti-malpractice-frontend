import { Building2 } from "lucide-react";

export const DepartmentHeader = () => {
  return (
    <div className="mb-8 text-center">
      <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
        <Building2 className="w-8 h-8 text-indigo-600" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Academic Departments
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Explore our diverse range of academic departments, each dedicated to
        excellence in teaching and research
      </p>
    </div>
  );
};
