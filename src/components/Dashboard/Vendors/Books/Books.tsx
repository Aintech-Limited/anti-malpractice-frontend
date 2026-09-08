"use client";

import { useEffect, useState } from "react";
import { Pagination } from "../../Lecturer/CourseMaterials/Pagination/Pagination";
import { IBookClientProps, IBook } from "./interface";
import { MaterialsHeader as BooksHeader } from "../../Lecturer/CourseMaterials/MaterialsHeader/MaterialsHeader";
import { MaterialsStats as BooksStats } from "../../Lecturer/CourseMaterials/MaterialsStats/MaterialsStats";
import { MaterialsFilters as BookFilters } from "../../Lecturer/CourseMaterials/MaterialsFilters/MaterialsFilters";
import { LoadingSkeleton } from "../../Lecturer/CourseMaterials/LoadingSkeleton/LoadingSkeleton";
import { MaterialsList as BooksList } from "../../Lecturer/CourseMaterials/MaterialsList/MaterialsList";
import {
  calculateAverageRating,
  getMaterialStats,
} from "../../Lecturer/CourseMaterials/utils/materialHelpers";
import { useBooks } from "./hooks/useBooks";
import { useBooksFilters } from "./hooks/useBookFilters";
import { EditMaterialModal as EditBookModal } from "../../Lecturer/CourseMaterials/modals/EditMaterialModal";
import PDFViewer from "../../Student/CourseMaterial/MaterialCard/PDFViewer/PDFViewer";
import { ViewMaterialModal as ViewBookModal } from "../../Lecturer/CourseMaterials/modals/ViewMaterialModal";
import { DeleteMaterialModal as DeleteBookModal } from "../../Lecturer/CourseMaterials/modals/DeleteMaterialModal";
import { CreateBookModal } from "./CreateBookModal/CreateBookModal";

const BooksClient = ({
  initialBooks,
  initialMeta,
  initialFilters,
}: IBookClientProps) => {
  const {
    materials,
    meta,
    loading,
    selectedMaterial,
    PdfURL,
    modalStage,

    updateMaterials,
    setLoadingState,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openViewModal,
    closeViewModal,
    closeViewPDFModal,
    openViewPDFModal,
  } = useBooks(initialBooks.books, initialMeta);

  const {
    filters,
    showFilters,
    hasActiveFilters,
    setShowFilters,
    updateFilters,
    fetchPage,
    clearFilters,
  } = useBooksFilters(initialFilters);

  const [stats, setStats] = useState(() =>
    getMaterialStats(initialBooks.books),
  );

  const [avgRating, setAvgRating] = useState(() =>
    calculateAverageRating(initialBooks.books),
  );

  useEffect(() => {
    setStats(getMaterialStats(materials));
    setAvgRating(calculateAverageRating(materials));
  }, [materials]);

  const handlePageChange = async (page: number) => {
    setLoadingState(true);
    const data = await fetchPage(page);
    updateMaterials(data.data, data.meta);
    setLoadingState(false);
  };

  const handleMaterialCreated = (newMaterial: IBook) => {
    updateMaterials([newMaterial, ...materials], meta, true);
    closeCreateModal();
  };

  const handleMaterialUpdated = (updatedMaterial: IBook) => {
    const updatedMaterials = materials.map((m) =>
      m.id === updatedMaterial.id ? updatedMaterial : m,
    );
    updateMaterials(updatedMaterials, meta);
    closeEditModal();
  };

  const handleMaterialDeleted = (deletedId: string) => {
    const filteredMaterials = materials.filter((m) => m.id !== deletedId);
    updateMaterials(filteredMaterials, {
      ...meta,
      totalItems: meta.totalItems - 1,
    });
    closeDeleteModal();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BooksHeader
          totalMaterials={meta.totalItems}
          onCreateMaterial={openCreateModal}
          title="Books Management"
        />

        <BooksStats
          totalMaterials={stats.total}
          totalDownloads={stats.totalDownloads}
          totalRevenue={initialBooks.totalRevenue}
          averageRating={avgRating}
        />

        <BookFilters
          filters={filters}
          showFilters={showFilters}
          hasActiveFilters={hasActiveFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onUpdateFilters={updateFilters}
          onClearFilters={clearFilters}
        />

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <BooksList
            materials={materials}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}

        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          hasNextPage={meta.hasNextPage}
          hasPreviousPage={meta.hasPreviousPage}
          onPageChange={handlePageChange}
        />
      </div>

      {modalStage === "create_material" && (
        <CreateBookModal
          onClose={closeCreateModal}
          onSuccess={handleMaterialCreated}
        />
      )}

      {modalStage === "edit_material" && selectedMaterial && (
        <EditBookModal
          material={selectedMaterial}
          onClose={closeEditModal}
          onSuccess={handleMaterialUpdated}
        />
      )}

      {modalStage === "delete_material" && selectedMaterial && (
        <DeleteBookModal
          material={selectedMaterial}
          onClose={closeDeleteModal}
          onSuccess={() => handleMaterialDeleted(selectedMaterial.id)}
        />
      )}

      {modalStage === "edit_material" && selectedMaterial && (
        <EditBookModal
          material={selectedMaterial}
          onClose={closeEditModal}
          onSuccess={handleMaterialUpdated}
        />
      )}

      {modalStage === "view_material" && selectedMaterial && (
        <ViewBookModal
          material={selectedMaterial}
          onClose={closeViewModal}
          onPreviewPDF={openViewPDFModal}
        />
      )}

      {modalStage === "view_pdf" && PdfURL && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4"
          onClick={closeViewPDFModal}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2
                className="text-xl font-normal text-gray-800 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={closeViewPDFModal}
              >
                Close
              </h2>
              <PDFViewer url={PdfURL} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default BooksClient;
