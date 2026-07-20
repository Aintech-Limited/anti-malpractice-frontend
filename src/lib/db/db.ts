import Dexie, { Table } from "dexie";
import {
  IDBExam,
  IDBExamAnswer,
  IDBExamQuestion,
  IDBExamMeta,
  IDBExamToken,
  IDBExamViolationEvidence,
  IDBExamViolations,
} from "./interface";

class LiveExamDatabase extends Dexie {
  fdExams!: Table<IDBExam>;
  fdExamMetas!: Table<IDBExamMeta>;
  fdExamQuestions!: Table<IDBExamQuestion>;
  fdExamAnswers!: Table<IDBExamAnswer>;
  fdExamToken!: Table<IDBExamToken>;
  fdExamViolations!: Table<IDBExamViolations>;
  fdExamViolationEvidence!: Table<IDBExamViolationEvidence>;

  constructor() {
    super("LiveExamDatabase");

    this.version(1).stores({
      fdExams: "id",
      fdExamMetas: "examId",
      fdExamQuestions: "id, examId, attemptId",
      fdExamAnswers:
        "[attemptId+questionId], examId, attemptId, questionId, synced, updatedAt, [examId+synced]",
      fdExamToken: "[examId+userId], examId, userId",
      fdExamViolations: "[examId+userId], examId, attemptId",
      fdExamViolationEvidence: "[examId+userId], examId, attemptId, userId",
    });
  }
}

export const db = new LiveExamDatabase();
