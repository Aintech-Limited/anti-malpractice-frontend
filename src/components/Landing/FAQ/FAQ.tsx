"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { faqData } from "./data";

const FAQ = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (selectedIndex !== null) {
    const item = faqData[selectedIndex];
    return (
      <section className="max-w-3xl h-200 mx-auto px-6 py-16 animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => setSelectedIndex(null)}
          className="flex items-center text-blue-600 mt-20 font-medium mb-8 hover:underline"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to all questions
        </button>

        <div className="border-b border-gray-200 pb-8 m-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {item.question}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 font-sans animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Frequently asked questions from lecturers to their students, and other
          eBooks customers
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {faqData.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="w-full flex items-center justify-between py-8 text-left group hover:bg-gray-50 px-4 -mx-4 rounded-xl transition-all"
          >
            <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {item.question}
            </span>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
