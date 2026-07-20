"use client";

import { RefObject } from "react";

const ExamLiveCameraFeed = ({
  videoRef,
  faceDetectionStatus,
}: {
  faceDetectionStatus: string;
  videoRef: RefObject<HTMLVideoElement | null>;
}) => {
  return (
    <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white ring-1 ring-gray-200 aspect-video relative mt-10">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover grayscale-[0.5]"
      />
      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 px-2 py-0.5 rounded-full">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
          Live
        </span>
      </div>
      {/* face detection status indicator */}
      <div className="absolute bottom-2 left-2 right-2">
        <div
          className={`text-[10px] font-bold px-2 py-1 rounded-full text-center ${
            faceDetectionStatus === "detected"
              ? "bg-green-500/80 text-white"
              : "bg-red-500/80 text-white animate-pulse"
          }`}
        >
          {faceDetectionStatus === "detected"
            ? "Face Detected ✓"
            : faceDetectionStatus === "not_detected"
              ? "Face Not Detected!"
              : "Multiple Faces Detetcted!"}
        </div>
      </div>
    </div>
  );
};

export default ExamLiveCameraFeed;
