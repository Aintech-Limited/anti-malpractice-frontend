"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Loader2, Upload, X, User } from "lucide-react";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { IAvatarUploaderProps, IUploadApiResponse } from "./interface";

const AvatarUploader = ({ avatar }: IAvatarUploaderProps) => {
  const { user, updateUser } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isValidAvatar = Boolean(
    avatar && typeof avatar === "string" && avatar.trim() !== "",
  );

  // Cleanup object URL preview to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2MB max limit");
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setSelectedFile(file);

    // Generate local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleCancelSelection = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      const response = await fetch("/api/v1/uploads/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const resData: IUploadApiResponse = await response.json();

      if (resData.success && resData.data?.url) {
        const newAvatarURL = resData.data.url;

        setPreviewUrl(newAvatarURL);
        setSelectedFile(null);
        setSuccessMsg("Avatar updated successfully!");

        if (user && updateUser) {
          updateUser({
            ...user,
            avatar: newAvatarURL,
          });
        }
      } else {
        throw new Error(resData.message || "Failed to upload avatar");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred during upload";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const currentDisplaySrc = previewUrl || (isValidAvatar ? avatar : null);

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xs sm:max-w-sm mx-auto p-4 bg-white rounded-2xl shadow-sm border border-blue-50 mt-10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="relative group w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-blue-100 bg-blue-50 overflow-hidden shadow-inner flex items-center justify-center transition-all duration-200 hover:border-blue-300">
        {currentDisplaySrc ? (
          <Image
            src={currentDisplaySrc}
            alt="User Avatar"
            fill
            sizes="(max-width: 640px) 112px, 144px"
            className="object-cover"
            priority
          />
        ) : (
          <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-300" />
        )}

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 cursor-pointer disabled:cursor-not-allowed"
          title="Change photo"
        >
          <Camera className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-[10px] sm:text-xs font-medium">Change</span>
        </button>
      </div>

      {selectedFile && !isUploading && (
        <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-top-1 duration-200">
          <button
            type="button"
            onClick={handleUpload}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button
            type="button"
            onClick={handleCancelSelection}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-blue-600 text-xs sm:text-sm font-medium py-1">
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading image...
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium text-center bg-red-50 py-1.5 px-3 rounded-lg border border-red-100 w-full">
          {error}
        </p>
      )}

      {successMsg && (
        <p className="text-xs text-emerald-600 font-medium text-center bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-100 w-full">
          {successMsg}
        </p>
      )}
    </div>
  );
};

export default AvatarUploader;
