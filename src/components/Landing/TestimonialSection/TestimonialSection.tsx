"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "./data";
import { APP_NAME } from "@/src/lib/data";

const AUTO_SLIDE_INTERVAL = 5000;

const TestimonialSection = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    resetTimer();
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);

    return () => resetTimer();
  }, [index]);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className="relative bg-blue-600 py-20 overflow-hidden overflow-y-visible">
      {/* Header */}
      <div className="text-center text-white mb-14 px-4">
        <h2 className="text-2xl md:text-4xl font-bold">
          Don&apos;t take our word for it!
        </h2>
        <p className="mt-2 text-sm md:text-base opacity-90">
          See what some of our customers have to say about using {APP_NAME}.
        </p>
      </div>

      {/* White Cut Bars */}
      <div className="flex justify-between  mb-20 ">
        <div className="h-6 bg-white w-[43%]" />
        <div className="h-6 bg-white w-[43%]" />
      </div>

      {/* Slider */}
      <div className="relative max-w-5xl mx-auto px-4">
        <div className="relative h-105 flex items-center justify-center">
          {/* STACKED CARDS */}
          <div className="absolute w-[89%] h-92 bg-white/70 rounded-3xl translate-y-6 scale-85 shadow-lg" />
          <div className="absolute w-[88%] h-95 bg-white/70 rounded-3xl translate-y-6 scale-85 shadow-lg" />
          <div className="absolute w-[87%] h-97 bg-white/70 rounded-3xl translate-y-6 scale-85 shadow-lg" />

          {/* ACTIVE SLIDE */}
          <div className="relative w-full overflow-hidden  overflow-y-visible">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${index * 100}%)`,
              }}
            >
              {testimonials.map((item) => (
                <div key={item.id} className="min-w-full flex justify-center">
                  <div className="relative bg-white rounded-3xl shadow-2xl p-7 md:p-10 max-w-3xl w-full h-78 mt-10">
                    {/* Floating Avatar */}
                    <div className="absolute -top-10 right-175">
                      <div className="w-40 h-40 rounded-full bg-white p-1 shadow-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={150}
                          height={150}
                          className="rounded-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-14">
                      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                        {item.message}
                      </p>

                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 md:-left-46 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-700 transition p-3 rounded-full text-white shadow-xl"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 md:-right-46 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-700 transition p-3 rounded-full text-white shadow-xl"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                index === i ? "bg-white scale-110" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
