import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ExamCard from "../ExamCard/ExamCard";
import { type IExamSectionProps } from "./interface";

const ExamSection = ({ title, exams, type, badgeColor }: IExamSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [exams]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;

      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-20 last:mb-0">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 border border-gray-200 rounded-lg transition-all active:scale-90
              ${
                !canScrollLeft
                  ? "opacity-30 cursor-not-allowed bg-gray-50 text-gray-400"
                  : "hover:bg-white hover:shadow-sm bg-white text-gray-900"
              }`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 border border-gray-200 rounded-lg transition-all active:scale-90
              ${
                !canScrollRight
                  ? "opacity-30 cursor-not-allowed bg-gray-50 text-gray-400"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm"
              }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {exams.map((exam, i) => (
          <div
            key={i}
            className="min-w-full md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.35rem)] snap-start"
          >
            <ExamCard
              title={exam.title}
              startsIn={exam.startsIn}
              details={exam.details}
              syllabus={exam.syllabus}
              type={type}
              badgeColor={badgeColor}
              exams={[]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamSection;
