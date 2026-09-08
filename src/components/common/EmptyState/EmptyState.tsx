"use client";

import { PlusCircle } from "lucide-react";
import { buttonVariants, iconMap, sizeConfig } from "./data";
import { IEmptyStateProps } from "./interface";

export const EmptyState = ({
  title,
  description,
  icon = "folder",
  action,
  secondaryAction,
  illustration,
  size = "md",
  bordered = false,
  className = "",
  searchTerm,
  onClearSearch,
}: IEmptyStateProps) => {
  const IconComponent = iconMap[icon];
  const styles = sizeConfig[size];

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        ${styles.container}
        ${bordered ? "border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50" : ""}
        ${className}
      `}
    >
      {illustration ? (
        <div
          className={`${styles.iconContainer} flex items-center justify-center`}
        >
          {illustration}
        </div>
      ) : (
        <div
          className={`
          ${styles.iconContainer} 
          bg-linear-to-br from-gray-100 to-gray-200 
          rounded-2xl flex items-center justify-center
          shadow-inner
        `}
        >
          <IconComponent
            className={`${styles.icon} text-gray-400`}
            strokeWidth={1.5}
          />
        </div>
      )}

      {/* Title */}
      <h3 className={`font-semibold text-gray-900 ${styles.title} mb-2`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`text-gray-500 ${styles.description} max-w-md mb-6`}>
          {description}
        </p>
      )}

      <p className="text-gray-500">
        {searchTerm
          ? `No data match "${searchTerm}". Try a different search term.`
          : "No Data available at the moment."}
      </p>
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Clear Search
        </button>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className={`flex ${styles.buttonGap} mt-2`}>
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`
                ${styles.button}
                ${buttonVariants[secondaryAction.variant || "outline"]}
                rounded-lg font-medium transition-all duration-200
                hover:shadow-md active:scale-95
              `}
            >
              {secondaryAction.label}
            </button>
          )}
          {action && (
            <button
              onClick={action?.onClick}
              className={`
                ${styles.button}
                ${buttonVariants[action.variant || "primary"]}
                rounded-lg font-medium transition-all duration-200
                hover:shadow-md active:scale-95
                flex items-center gap-2
              `}
            >
              <PlusCircle className="w-4 h-4" />
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
