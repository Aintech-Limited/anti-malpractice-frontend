import { memo } from "react";
import { IMaterialListViewProps } from "./interface";
import { formatFileSize } from "../utils/utils";
import { Eye, ShoppingCart } from "lucide-react";

const MaterialListView = memo(
  ({
    material,
    purchasingId,
    getMaterialIcon,
    onSelectMaterial,
    onPurchase,
    onViewMaterial,
    onSetViewMode,
  }: IMaterialListViewProps) => {
    return (
      <div
        key={material.id}
        className={`border rounded-lg p-4 transition-all ${
          material.isPurchased
            ? "border-green-200 bg-green-50 hover:shadow-md"
            : "border-gray-200 bg-white hover:shadow-md"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {getMaterialIcon(material.fileType)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {material.title}
            </h3>
            {material.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {material.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{material.fileType.toUpperCase()}</span>
              {material.size && (
                <span>{formatFileSize(parseInt(material.size))}</span>
              )}
              <span>
                {material.uploadedAt
                  ? new Date(material.uploadedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            {material.price && !material.isPurchased && (
              <p className="text-sm font-semibold text-gray-900 mt-2">
                ${Number(material.price).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {material.isPurchased ? (
            <>
              <button
                onClick={() => onViewMaterial(material)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => {
                  onSelectMaterial(material);
                  onSetViewMode("preview");
                }}
                className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Details
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onSelectMaterial(material);
                  onSetViewMode("preview");
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => onPurchase(material)}
                disabled={purchasingId === material.id}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {purchasingId === material.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Purchase
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    );
  },
);
MaterialListView.displayName = "MaterialListView";
export default MaterialListView;
