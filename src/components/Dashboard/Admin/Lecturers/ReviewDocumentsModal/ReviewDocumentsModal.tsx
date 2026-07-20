/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, XCircle, Eye } from "lucide-react";
import { IReviewDocumentsModalProps } from "./interface";
import { KycStatusEnum, TKycStatusEnum } from "@/src/lib/enums";
import { toast } from "react-toastify";

export default function ReviewDocumentsModal({
  isOpen,
  onClose,
  lecturer,
  onVerify,
}: IReviewDocumentsModalProps) {
  const [verifying, setVerifying] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"id" | "selfie">("id");
  const [imageErrors, setImageErrors] = useState({
    front: false,
    back: false,
    selfie: false,
  });
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [IDImageFront, setIDImageFront] = useState<string | null>(null);
  const [IDImageBack, setIDImageBack] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<boolean>(true);

  const fetchImages = async () => {
    setLoadingImages(true);
    setImageErrors(() => ({ back: false, front: false, selfie: false }));
    try {
      const response = await fetch(`/api/v1/kyc/verify/${lecturer?.id}`, {
        method: "GET",
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message ?? "Cold not fetch images");
        return;
      }
      setIDImageBack(data.data.back ?? null);
      setIDImageFront(data.data.front ?? null);
      setSelfieImage(data.data.selfie ?? null);
    } catch (error) {
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !lecturer?.id) return;

    fetchImages();
  }, [isOpen, lecturer?.id]);

  useEffect(() => {
    if (!isOpen) {
      setIDImageFront(null);
      setIDImageBack(null);
      setSelfieImage(null);

      setImageErrors({
        front: false,
        back: false,
        selfie: false,
      });
    }
  }, [isOpen]);

  if (!isOpen || !lecturer) return null;

  const handleVerify = async (
    type: "id" | "selfie", // would always be 'id' regardless
    status: TKycStatusEnum,
  ) => {
    if (
      (!IDImageBack || !IDImageFront || !selfieImage) &&
      status === KycStatusEnum.APPROVED
    ) {
      toast.error("Cannot APPROVE Lecturer when an ID or a Selfie is missing");
      return;
    }
    setVerifying(type);
    await onVerify(lecturer.id, type, status);
    setVerifying(null);
  };

  const getFullName = () => `${lecturer.firstName} ${lecturer.lastName}`;

  const isVerified = activeTab === "id" ? lecturer.idVerified : false;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Review Documents</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* Lecturer Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">{getFullName()}</h3>
            <p className="text-sm text-gray-500">{lecturer.email}</p>
            {/* <p className="text-sm text-gray-500">{lecturer.departmentName}</p> */}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("id")}
              className={`px-4 py-2 font-medium transition ${
                activeTab === "id"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ID Document
              {lecturer.idVerified && (
                <CheckCircle size={14} className="inline ml-1 text-green-500" />
              )}
            </button>
            {/* <button
							onClick={() => setActiveTab('selfie')}
							className={`px-4 py-2 font-medium transition ${
								activeTab === 'selfie'
									? 'text-indigo-600 border-b-2 border-indigo-600'
									: 'text-gray-500 hover:text-gray-700'
							}`}
						>
							Selfie
							{lecturer.selfieVerified && (
								<CheckCircle size={14} className="inline ml-1 text-green-500" />
							)}
						</button> */}
          </div>

          {/* Image Display */}
          <div className="mb-6">
            <KYCImageCard
              fullName={getFullName()}
              imageError={imageErrors.front}
              imageName="FRONT ID"
              message="No ID document uploaded"
              onImageError={() =>
                setImageErrors((prev) => ({
                  ...prev,
                  front: true,
                }))
              }
              imageURL={IDImageFront}
            />
          </div>
          <div className="mb-6">
            <KYCImageCard
              fullName={getFullName()}
              imageError={imageErrors.back}
              imageName="BACK ID"
              message="No ID document uploaded"
              onImageError={() =>
                setImageErrors((prev) => ({
                  ...prev,
                  back: true,
                }))
              }
              imageURL={IDImageBack}
            />
          </div>
          <div className="mb-6">
            <KYCImageCard
              fullName={getFullName()}
              imageError={imageErrors.selfie}
              imageName="SELFIE"
              message="No Selfie uploaded"
              onImageError={() =>
                setImageErrors((prev) => ({
                  ...prev,
                  selfie: true,
                }))
              }
              imageURL={selfieImage}
            />
          </div>

          {/* Verification Status & Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {isVerified ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <CheckCircle size={12} />
                  Verified
                </span>
              ) : (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <XCircle size={12} />
                  Pending Review
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {!isVerified && (
                <>
                  <button
                    onClick={() =>
                      handleVerify(activeTab, KycStatusEnum.REJECTED)
                    }
                    disabled={verifying === activeTab}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    {verifying === activeTab ? "Processing..." : "Reject"}
                  </button>
                  <button
                    onClick={() =>
                      handleVerify(activeTab, KycStatusEnum.APPROVED)
                    }
                    disabled={verifying === activeTab}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    {verifying === activeTab ? "Processing..." : "Approve"}
                  </button>
                </>
              )}
              {isVerified && (
                <button
                  onClick={() =>
                    handleVerify(activeTab, KycStatusEnum.REJECTED)
                  }
                  disabled={verifying === activeTab}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  <XCircle size={16} />
                  {verifying === activeTab
                    ? "Processing..."
                    : "Revoke Verification"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export interface IKYCImageCardProps {
  imageURL?: string | null;
  onImageError: () => void;
  imageName: string;
  imageError: boolean;
  message: string;
  fullName: string;
}
const KYCImageCard = ({
  imageName,
  onImageError,
  imageURL,
  imageError,
  message = "No ID document uploaded",
  fullName,
}: IKYCImageCardProps) => {
  if (imageError || !imageURL) {
    return (
      <div className="bg-gray-100 rounded-lg p-12 text-center">
        <p className="text-gray-500">{message}</p>
      </div>
    );
  }

  return (
    <div
      className="relative bg-gray-100 rounded-lg overflow-hidden"
      style={{ minHeight: "400px" }}
    >
      <img
        src={imageURL}
        alt={`image for ${fullName}`}
        className="w-full h-auto object-contain max-h-[70vh]"
        onError={onImageError}
      />
      {/* <a
						href={IDImageFront}
						download
						target="_blank"
						rel="noopener noreferrer"
						className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-lg shadow-md hover:bg-white transition"
						>
							<Download size={20} className="text-gray-700" />
						</a> */}
      <div className="bg-gray-100 rounded-lg p-12 text-center">
        <p className="text-gray-500">{imageName}</p>
      </div>
    </div>
  );
};
