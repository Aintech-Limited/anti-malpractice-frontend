import { TDBExamAnswerSyncType, DBExamAnswerSyncEnum } from "../enums";
import { db } from "./db";
import {
  IDBExam,
  IDBExamAnswer,
  IDBExamMeta,
  IDBExamQuestion,
  IDBExamToken,
  IDBExamViolationEvidence,
  IDBExamViolations,
} from "./interface";

class DBExamRepository {
  static async initializeExam(
    exam: IDBExam,
    meta: IDBExamMeta,
    examToken: IDBExamToken,
  ) {
    try {
      await db.transaction(
        "rw",
        db.fdExams,
        db.fdExamMetas,
        db.fdExamToken,
        async () => {
          await db.fdExams.put(exam);
          await db.fdExamMetas.put(meta);
          await db.fdExamToken.put(examToken);
        },
      );
      return null;
    } catch (error) {
      console.error("Error initializing exam:", error);
    }
  }

  static async saveExamMeta(meta: IDBExamMeta) {
    try {
      await db.fdExamMetas.put({
        ...meta,
        createdAt: meta?.createdAt ?? new Date(),
        updatedAt: new Date(),
      });
      return null;
    } catch (error) {
      console.error("Error saving exam meta: ", error);
      return;
    }
  }

  static async getExamMeta(examId: string) {
    try {
      return await db.fdExamMetas.get(examId);
    } catch (error) {
      console.error("Error fetching exam meta: ", error);
      return;
    }
  }

  static async deleteMeta(examId: string) {
    try {
      return await db.fdExamMetas.where("examId").equals(examId).delete();
    } catch (error) {
      console.error("Error deleting exam meta: ", error);
      return 0;
    }
  }
  static async saveExamToken(examToken: IDBExamToken) {
    try {
      await db.fdExamToken.put({
        ...examToken,
      });
      return null;
    } catch (error) {
      console.error("Error saving exam token: ", error);
      return;
    }
  }

  static async getExamToken(examId: string, userId: string) {
    try {
      console.log(examId, userId);
      const examToken = await db.fdExamToken.get([examId, userId]);
      // console.log('exam token: ', examToken);
      return examToken;
    } catch (error) {
      console.error("Error fetching exam token: ", error);
      return;
    }
  }

  static async deleteToken(examId: string, userId: string) {
    try {
      return await db.fdExamToken
        .where("examId")
        .equals([examId, userId])
        .delete();
    } catch (error) {
      console.error("Error deleting exam token: ", error);
      return 0;
    }
  }

  static async saveExam(exam: IDBExam) {
    try {
      await db.fdExams.put({
        ...exam,
        submitted: false,
      });
      return null;
    } catch (error) {
      console.error("Error saving live exam: ", error);
      return;
    }
  }

  static async getExam(examId: string) {
    try {
      return await db.fdExams.get(examId);
    } catch (error) {
      console.error("Error fetching exam: ", error);
      return;
    }
  }

  static async updateExamAsSubmitted(examId: string) {
    try {
      return await db.fdExams.update(examId, {
        submitted: true,
      });
    } catch (error) {
      console.error("Error updating live exam: ", error);
      return 0;
    }
  }

  static async deleteExam(examId: string) {
    try {
      return await db.fdExams.delete(examId);
    } catch (error) {
      console.error("Error deleting live exam: ", error);
      return 0;
    }
  }

  static async saveExamQuestions(questions: IDBExamQuestion[]) {
    try {
      if (!questions) {
        console.log("questions is empty for saving");
        return;
      }
      await db.fdExamQuestions.bulkPut(questions);
      return null;
    } catch (error) {
      console.error("Error saving live exam questions: ", error);
      return;
    }
  }

  static async getExamQuestions(examId: string) {
    try {
      return await db.fdExamQuestions.where("examId").equals(examId).toArray();
    } catch (error) {
      console.error("Error fetthcing live exam questions: ", error);
      return;
    }
  }

  static async deleteExamQuestions(examId: string) {
    try {
      return await db.fdExamQuestions.where("examId").equals(examId).delete();
    } catch (error) {
      console.error("Error deleting live exam questions: ", error);
      return 0;
    }
  }

  static async saveExamAnswers(answer: IDBExamAnswer) {
    try {
      const existing = await db.fdExamAnswers.get([
        answer.attemptId,
        answer.questionId,
      ]);

      const changed =
        existing?.optionId !== answer.optionId ||
        existing?.answerText?.toLowerCase() !==
          answer.answerText?.toLowerCase();

      await db.fdExamAnswers.put({
        ...answer,
        updatedAt: Date.now(),
        synced: changed
          ? DBExamAnswerSyncEnum.PENDING
          : (existing?.synced ?? DBExamAnswerSyncEnum.PENDING),
      });
      return null;
    } catch (error) {
      console.error("Error saving live exam answer: ", error);
      return;
    }
  }

  static async getExamAnswer(attemptId: string, questionId: string) {
    try {
      return await db.fdExamAnswers.get([attemptId, questionId]);
    } catch (error) {
      console.error("Error fetching exam answer:", error);
      return null;
    }
  }

  static async getExamAnswers(examId: string, synced?: TDBExamAnswerSyncType) {
    try {
      if (synced) {
        const answers = await db.fdExamAnswers
          .where("[examId+synced]")
          .equals([examId, synced])
          .toArray();
        return answers;
      }
      const answers = await db.fdExamAnswers
        .where("examId")
        .equals(examId)
        .toArray();
      return answers ?? [];
    } catch (error) {
      console.error("Error fetching live exam answer: ", error);
      return [];
    }
  }

  static async updateExamAnswerSynced(
    answers: IDBExamAnswer[],
    synced: TDBExamAnswerSyncType,
  ) {
    try {
      const updatedResults = await Promise.all(
        answers.map((answer) => {
          db.fdExamAnswers.update([answer.attemptId, answer.questionId], {
            synced,
          });
        }),
      );
      console.log("updatedResults: ", updatedResults);
      return updatedResults.length;
    } catch (error) {
      console.error("Error updating answers synced field: ", error);
      return 0;
    }
  }

  static async deleteExamAnswers(examId: string) {
    try {
      return await db.fdExamAnswers.where("examId").equals(examId).delete();
    } catch (error) {
      console.error("Error deleting live exam answer: ", error);
      return 0;
    }
  }

  static async saveExamViolation(examViolations: IDBExamViolations) {
    try {
      await db.fdExamViolations.put({
        ...examViolations,
      });
      return null;
    } catch (error) {
      console.error("Error saving exam violation: ", error);
      return;
    }
  }

  static async getExamViolations(examId: string, userId: string) {
    try {
      return await db.fdExamViolations.get([examId, userId]);
    } catch (error) {
      console.error("Error fetching exam violations: ", error);
      return;
    }
  }

  static async deleteViolation(examId: string, userId: string) {
    try {
      return await db.fdExamViolations
        .where("examId")
        .equals([examId, userId])
        .delete();
    } catch (error) {
      console.error("Error deleting exam violation: ", error);
      return 0;
    }
  }

  static async saveExamViolationEvidence(
    examViolationEvidence: IDBExamViolationEvidence,
  ) {
    try {
      await db.fdExamViolationEvidence.put({
        ...examViolationEvidence,
      });
      return null;
    } catch (error) {
      console.error("Error saving exam violation evidence: ", error);
      return;
    }
  }

  static async getExamViolationEvidence(examId: string, userId: string) {
    try {
      return await db.fdExamViolationEvidence.get([examId, userId]);
    } catch (error) {
      console.error("Error fetching exam violations evidence: ", error);
      return;
    }
  }

  static async deleteViolationEvidence(examId: string, userId: string) {
    try {
      return await db.fdExamViolationEvidence
        .where("examId")
        .equals([examId, userId])
        .delete();
    } catch (error) {
      console.error("Error deleting exam violation evidence: ", error);
      return 0;
    }
  }

  static async clearExamData(examId: string) {
    try {
      await db.transaction(
        "rw",
        db.fdExams,
        db.fdExamMetas,
        db.fdExamQuestions,
        db.fdExamAnswers,
        async () => {
          await db.fdExams.delete(examId);
          await db.fdExamMetas.where("examId").equals(examId).delete();
          await db.fdExamQuestions.where("examId").equals(examId).delete();
          await db.fdExamAnswers.where("examId").equals(examId).delete();
        },
      );
    } catch (error) {
      console.error("Error clearing exam data:", error);
    }
  }
}

export default DBExamRepository;
