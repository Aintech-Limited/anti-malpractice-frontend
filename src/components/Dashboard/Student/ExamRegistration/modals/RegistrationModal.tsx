import { X } from "lucide-react";
import { RegistrationForm } from "./RegistrationForm";
import { IRegistrationModalProps } from "../interface";

export const RegistrationModal = ({
  exam,
  isOpen,
  onClose,
  onRegisterLater,
  onRegisterAndPay,
  isLoading,
}: IRegistrationModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = async (
    level: number,
    semester: number,
    payNow: boolean,
  ) => {
    if (!payNow) {
      await onRegisterLater(exam.id, level, semester);
    }
    onRegisterAndPay(exam.id, level, semester);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <RegistrationForm
          exam={exam}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
