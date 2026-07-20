import { ISearchAndFilterBarProps } from "./interface";

export const SearchAndFilterBar = ({
  searchQuery,
  selectedLevel,
  onSearchChange,
  onLevelChange,
}: ISearchAndFilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search courses by title or code..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <select
        value={selectedLevel}
        onChange={(e) =>
          onLevelChange(
            e.target.value === "all" ? "all" : parseInt(e.target.value),
          )
        }
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Levels</option>
        <option value="1">Level 100</option>
        <option value="2">Level 200</option>
        <option value="3">Level 300</option>
        <option value="4">Level 400</option>
      </select>
    </div>
  );
};
