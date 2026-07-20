"use client";

import { ChevronRight, Download, Star, X } from "lucide-react";
import Image from "next/image";
import { IMaterialCardProps } from "./interface";
import { useState } from "react";
import PDFViewer from "./PDFViewer/PDFViewer";
import { toast } from "react-toastify";

const MaterialCard = ({ material }: { material: IMaterialCardProps }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1); // TODO: use material.currentPage
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleDownload = async (purchasedMaterialId: string) => {
    try {
      const response = await fetch(
        `/api/v1/purchased-material?materialId=${purchasedMaterialId}`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to download material");
      }

      const contentDisposition = response.headers.get("content-disposition");
      let fileName = "material.pdf";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download click handler failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong downloading the file.",
      );
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  const handlePageChange = (page: number, total: number) => {
    setCurrentPage(page);
    setTotalPages(total);

    // TODO:: Save progress to backend
    // saveProgress(material.id, page, total);
  };

  const handleProgress = (page: number, total: number) => {
    const progress = Math.floor((page / total) * 100);
    console.log("progress: ", progress);

    // TODO:: Auto-save progress at intervals
    // if (progress % 10 === 0) {
    //   saveProgress(material.id, progress);
    // }
  };

  return (
    <>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 h-full hover:translate-x-4">
        <div className="w-1/3 h-48 rounded-lg overflow-hidden bg-gray-100 shadow-inner">
          <Image
            src={material.MaterialCover}
            alt={material.title}
            className="w-full h-full object-cover"
            width={180}
            height={90}
            loading="eager"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-black text-gray-900 leading-tight pr-4">
                Title: {material.title}
              </h4>
              <ChevronRight className="w-3 h-3 text-green-600 -rotate-45" />
            </div>
            <p className="text-[10px] text-gray-500 font-bold mt-1">
              By:{" "}
              <span className="text-blue-700">{`${material.lecturer.firstName} ${material.lecturer.lastName}`}</span>{" "}
              <span className="text-blue-700 ml-1 font-black">
                {`$${material.price}`}
              </span>
            </p>

            <div className="mt-2 space-y-0.5">
              <p className="text-[10px] text-gray-700 font-medium">
                Lecturer name:{" "}
                <span className="font-bold">{`${material.lecturer.firstName} ${material.lecturer.lastName}`}</span>
              </p>
              <p className="text-[10px] text-gray-700 font-medium">
                Course Code:{" "}
                <span className="font-bold">{material.courseCode}</span>
              </p>
              <p className="text-[10px] text-gray-700 font-medium">
                Purchased Date:{" "}
                <span className="font-bold">
                  {new Date(material.purchasedAt).toUTCString()}
                </span>
              </p>
            </div>
          </div>

          {/* <div className="flex items-center gap-3 mt-2">
						<span className="text-[10px] font-bold text-gray-700">
							Progress bar:
						</span>
						<div className="relative w-8 h-8 flex items-center justify-center">
							<div className="absolute inset-0 border-2 border-gray-100 rounded-full" />
							<svg className="w-full h-full transform -rotate-90">
								<circle
									cx="16"
									cy="16"
									r="14"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
									className="text-gray-100"
								/>
								<circle
									cx="16"
									cy="16"
									r="14"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
									strokeDasharray={`${2 * Math.PI * 14}`}
									strokeDashoffset={`${2 * Math.PI * 14 * (1 - material.progress / 100)}`}
									className="text-green-600 transition-all duration-300"
								/>
							</svg>
							<span className="text-[8px] font-black">
								{material.progress}%
							</span>
						</div>
					</div> */}

          <div className="space-y-2 mt-2">
            <button
              className="w-full h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
              onClick={handleOpenModal}
            >
              {material.progress > 0 ? "Continue Reading?" : "Start Reading?"}
            </button>
            <button
              onClick={() => handleDownload(material.id)}
              className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-shadow shadow-md shadow-blue-100"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>

          <div className="flex gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < material.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {material.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {material.courseCode} • {material.lecturer.firstName}{" "}
                  {material.lecturer.lastName}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <PDFViewer
                url={material.fileURL}
                onPageChange={handlePageChange}
                onProgress={handleProgress}
              />
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {currentPage > 0 && totalPages > 0 && (
                  <>
                    Page {currentPage} of {totalPages} •{" "}
                    {Math.round((currentPage / totalPages) * 100)}% read
                  </>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialCard;
