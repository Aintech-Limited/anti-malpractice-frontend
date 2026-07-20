import {
  bookImageOne,
  bookImageThree,
  bookImageTwo,
} from "@/public/assetLinks";
import { BookItem } from "./interface";

export const bookData: BookItem[] = [
  {
    id: 1,
    title: "Buy quality books",
    description: "Take secured Examinations.",
    imageUrl: bookImageOne,
  },
  {
    id: 2,
    title: "Expand your mind",
    description:
      "Sit velit sit ultrices dictum luctus fusce tempor in urna. Vitae egestas tincidunt sollicitudin etiam eget.",
    imageUrl: bookImageTwo,
  },
  {
    id: 3,
    title: "Build better habits",
    description:
      "Habit formation through reading leads to long-term personal growth.",
    imageUrl: bookImageThree,
  },
];
