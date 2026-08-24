"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/src/providers/auth/AuthContext";
import { IExamRegistrationForm } from "../interface";
import { validateRegistrationForm } from "../utils/validation";
import { generateAcademicSemesters } from "@/src/lib/helper";
import { YEAR_LEVELS } from "../utils/examConstants";
import { IRegistrationFormProps } from "./interface";

export const RegistrationForm = ({
  exam,
  onSubmit,
  isLoading,
}: IRegistrationFormProps) => {
  const { user } = useAuth();
  const [form, setForm] = useState<IExamRegistrationForm>({
    level: "",
    semester: "",
    // matricNo: user?.matricNo || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payNow, setPayNow] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log("value: ", value, ", name: ", name);
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateRegistrationForm(
      form.level,
      form.semester,
      form.matricNo,
    );

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    const levelNumber = parseInt(form.level);
    const semesterNumber = parseInt(form.semester);
    console.log("semesterNumber: ", semesterNumber);

    await onSubmit(levelNumber, semesterNumber, payNow);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl p-6 md:p-10 space-y-10">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-100 pb-10">
          <Image
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?&w=256&h=256&auto=format&fit=crop&crop=faces&q=80"
            alt="Student profile"
            className="w-40 h-40 rounded-3xl object-cover shadow-lg"
            width={70}
            height={30}
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">
              {exam.title}
            </h1>
            <p className="text-gray-500 mt-2 max-w-lg">
              Please fill in or verify your academic details below to complete
              registration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Semester/Session *
            </label>
            <select
              className={`w-full h-12 px-4 border rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.semester ? "border-red-500" : "border-gray-200"
              }`}
              value={form.semester}
              name="semester"
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Select Semester</option>
              {generateAcademicSemesters().map((item) => (
                <option key={item.view} value={item.semester}>
                  {item.view}
                </option>
              ))}
            </select>
            {errors.semester && (
              <p className="text-red-500 text-xs mt-1">{errors.semester}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Level/Class *
            </label>
            <select
              className={`w-full h-12 px-4 border rounded-xl bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors.level ? "border-red-500" : "border-gray-200"
              }`}
              value={form.level}
              name="level"
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Select Level</option>
              {YEAR_LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.level && (
              <p className="text-red-500 text-xs mt-1">{errors.level}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Matric/Registration No.
            </label>
            <input
              type="text"
              placeholder="ATU/CS/40231"
              name="matricNo"
              className="w-full h-12 px-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={form.matricNo}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex content-center items-center gap-3">
          <div className="flex items-center gap-4 pt-8 border-t border-gray-100">
            <button
              onClick={() => {
                setPayNow(false);
                handleSubmit();
              }}
              disabled={isLoading}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && !payNow
                ? "Registering..."
                : "Register Now Pay Later"}
            </button>
          </div>
          <div className="flex items-center gap-4 pt-8 border-t border-gray-100">
            <button
              onClick={() => {
                setPayNow(true);
                handleSubmit();
              }}
              disabled={isLoading}
              className="h-12 px-8 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && payNow ? "Registering..." : "Register Now Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
