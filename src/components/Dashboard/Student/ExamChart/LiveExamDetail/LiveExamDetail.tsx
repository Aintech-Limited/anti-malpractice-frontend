"use client";

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import Image from "next/image";
import { studentReadingImage } from "@/public/assetLinks";
import { guidelines } from "./utils/constants";
import { ILiveExamDetailsProps } from "./interface";
import DBExamRepository from "@/src/lib/db/repository";
import { useAuth } from "@/src/providers/auth/AuthContext";
import OngoingLiveExam from "./OngoingLiveExam/OngoingLiveExam";
import FaceCapture from "../../FaceAuthEnrollment/FaceCapture/FaceCapture";
import { toast } from "react-toastify";
import FaceAuthEnrollmentWarning from "./FaceAuthEnrollmentWarning/FaceAuthEnrollmentWarning";
import { ProtectedRouteEnum } from "@/src/lib/enums";
import { useRouter } from "next/navigation";
import {
  hideLoading,
  showLoading,
} from "@/src/redux/features/globalLoadingSlice/globalLoadingSlice";
import { useAppDispatch } from "@/src/redux/reduxStore";

const LiveExamDetail = ({
  examDetail,
  statusCode,
  success,
  message,
}: ILiveExamDetailsProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAuth();
  const [agreed, setAgreed] = useState<boolean>(false);
  const [startExamLoadingMessage, setStartExamLoadingMessage] =
    useState<boolean>(false);
  const [startExam, setStartExam] = useState<boolean>(false);
  const [showFaceAuth, setshowFaceAuth] = useState<boolean>(false);
  const [showFaceAuthEnrollmenError, setShowFaceAuthEnrollmenWarning] =
    useState<boolean>(false);
  console.log(JSON.stringify(examDetail));

  useEffect(() => {
    if (statusCode === 403 || !success) {
      toast.error(message);
      router.push(ProtectedRouteEnum.STUDENTS);
      return;
    }
  }, [statusCode, success, router, message]);

  useEffect(() => {
    if (loading) return;
    const initExam = async () => {
      let submitted = false;
      let startTime = new Date();
      let createdAt = new Date();
      const examExists = await DBExamRepository.getExam(examDetail.examId);
      const examMetaExists = await DBExamRepository.getExamMeta(
        examDetail.examId,
      );
      if (examExists) {
        submitted = examExists.submitted;
        startTime = examExists.startTime;
      }
      if (examMetaExists) {
        createdAt = examMetaExists.createdAt;
      }
      console.log("examDetail: ", JSON.stringify(examDetail));
      DBExamRepository.initializeExam(
        {
          duration: examDetail.duration.Total
            ? Number(examDetail.duration.Total)
            : 0, // in minutes
          id: examDetail.examId,
          startTime,
          submitted,
          title: examDetail.examTitle,
          current: true,
          userId: user!.id,
        },
        {
          createdAt,
          DateAndTime: examDetail.DateAndTime,
          duration: examDetail.duration,
          examId: examDetail.examId,
          examTitle: examDetail.examTitle,
          fullMarks: examDetail.fullMarks,
          totalQuestions: examDetail.totalQuestions,
          updatedAt: new Date(),
          isFresh: examDetail.isFresh, // is only true when ExamToken is generated on first call
          startTime: examDetail.startTime, // Date.now or new Date().getTime
          startTimeISO: examDetail.startTimeISO, // new Date().toISOString
        },
        {
          examId: examDetail.examId,
          proctoringId: examDetail.proctoringId,
          userId: user!.id,
          examAttemptId: examDetail.examAttemptId,
        },
      );
    };

    initExam();
  }, [examDetail, user, loading]);

  const handleStartExam = async () => {
    dispatch(showLoading("Preparing Verification..."));
    try {
      const response = await fetch("/api/v1/users", { method: "GET" });
      const data = await response.json();
      if (data.success) {
        if (data.data.faceAuthEnabled) {
          setshowFaceAuth(true);
          // setStartExam(true); // TODO: keeping this here for testing. remove after i am done testing
          return;
        } else {
          toast.error(
            "Seems like you have not Enrolled for Face Verification.",
          );
          toast.error("Enroll for Face Verification before Starting Exam");
          setShowFaceAuthEnrollmenWarning(true);
        }
      }
    } catch (error) {
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleOnFaceVerificationComplete = (data: {
    success: boolean;
    message: string;
  }) => {
    if (data.success) {
      setshowFaceAuth(false);
      toast.success(data.message);
      setStartExamLoadingMessage(true);
      setTimeout(() => {
        setStartExamLoadingMessage(false);
        setStartExam(true);
      }, 2000);
      return;
    }
    toast.error(data.message);
    // setTimeout(() => { TODO: check if to uncomment
    // 	router.refresh();
    // }, 1000);
  };

  if (startExam) {
    return (
      <OngoingLiveExam
        initialDurationTime={examDetail.duration.Total}
        initialExamAttemptId={examDetail.examAttemptId}
        initialExamId={examDetail.examId}
        initialProctoringId={examDetail.proctoringId}
      />
    );
  }

  return (
    <section className="bg-white min-h-screen py-12 px-6 font-sans">
      {startExamLoadingMessage && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 modal-transition">
          <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-fade-in-up">
            <p className="p-5">Preparing Exam...</p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-[#EF5350] text-white px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold uppercase mb-4 animate-pulse-red">
            <Radio size={16} />
            LIVE EXAM
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            {examDetail.examTitle ?? "N/A"}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Full Marks */}
          <div className="bg-[#F1F5F9] rounded-xl p-6 border border-gray-100 shadow-sm">
            <h4 className="text-center font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              {examDetail?.fullMarks?.title ?? "N/A"}
            </h4>
            <div className="space-y-3">
              {examDetail?.fullMarks &&
                Object.entries(examDetail.fullMarks)
                  .filter((d) => d[0] !== "title")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-xs font-bold"
                    >
                      <span className="text-gray-500 uppercase">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
            </div>
          </div>
          {/* Duration */}
          <div className="bg-[#F1F5F9] rounded-xl p-6 border border-gray-100 shadow-sm">
            <h4 className="text-center font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              {examDetail?.duration?.title ?? "N/A"}
            </h4>
            <div className="space-y-3">
              {examDetail?.duration &&
                Object.entries(examDetail.duration)
                  .filter((d) => d[0] !== "title")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-xs font-bold"
                    >
                      <span className="text-gray-500 uppercase">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
            </div>
          </div>
          {/* Total Questions */}
          <div className="bg-[#F1F5F9] rounded-xl p-6 border border-gray-100 shadow-sm">
            <h4 className="text-center font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              {examDetail?.totalQuestions?.title ?? "N/A"}
            </h4>
            <div className="space-y-3">
              {examDetail?.totalQuestions &&
                Object.entries(examDetail.totalQuestions)
                  .filter((d) => d[0] !== "title")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-xs font-bold"
                    >
                      <span className="text-gray-500 uppercase">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
            </div>
          </div>
          {/* Date and Time */}
          <div className="bg-[#F1F5F9] rounded-xl p-6 border border-gray-100 shadow-sm">
            <h4 className="text-center font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              {examDetail?.DateAndTime?.title ?? "N/A"}
            </h4>
            <div className="space-y-3">
              {examDetail?.DateAndTime &&
                Object.entries(examDetail.DateAndTime)
                  .filter((d) => d[0] !== "title")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between text-xs font-bold"
                    >
                      <span className="text-gray-500 uppercase">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="bg-[#F1F5F9] rounded-3xl p-8 md:p-12 h-full">
            <h3 className="text-center font-bold text-gray-900 mb-8 text-lg underline underline-offset-8 decoration-2 decoration-gray-300">
              Guidelines for students
            </h3>
            <ol className="space-y-4">
              {guidelines.map((text, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-xs md:text-sm font-bold text-gray-700 leading-relaxed"
                >
                  <span className="text-gray-900">{i + 1}.</span>
                  {text}
                </li>
              ))}
            </ol>
          </div>

          <div className="relative h-full min-h-100">
            <Image
              src={studentReadingImage}
              alt="Students in exam hall"
              className="rounded-3xl object-cover w-full h-full shadow-lg"
              width={180}
              height={90}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center gap-8 border-t border-gray-100 pt-12">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">
              I agree with the terms and conditions
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            <button
              disabled={!agreed || !examDetail.examAttemptId}
              className={`px-12 py-4 rounded-xl font-bold text-sm transition-all shadow-lg
                ${
                  agreed && examDetail.examAttemptId
                    ? "bg-blue-700 text-white hover:bg-blue-800 shadow-blue-200 active:scale-95"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
              onClick={handleStartExam}
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>

      <FaceCapture
        isOpen={showFaceAuth}
        onCancel={() => setshowFaceAuth(false)}
        onEnrollmentComplete={handleOnFaceVerificationComplete}
        isVerification={true}
      />

      <FaceAuthEnrollmentWarning
        isOpen={showFaceAuthEnrollmenError}
        onClose={() => setShowFaceAuthEnrollmenWarning(false)}
      />
    </section>
  );
};

export default LiveExamDetail;
