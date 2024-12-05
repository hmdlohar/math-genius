"use server";

import wait from "@/utils/wait";
import { PrismaClient } from "@prisma/client";

export async function recordAnswer(io: {
  questionId: string;
  answer: string;
  userId: string;
  clientTimestamp: number; // This is going to tell us when actually client answered the question
}): Promise<{
  isWin: boolean;
  isSolved: boolean;
  error?: any;
}> {
  try {
    let prisma = new PrismaClient();
    let solvedAt = new Date(io.clientTimestamp);

    await prisma.$transaction(
      async (tx) => {
        // Lock the row by reading it within the transaction
        const question = await tx.question.findUnique({
          where: {
            id: io.questionId,
          },
        });

        if (!question) {
          throw new Error("Question not found");
        }

        if (question.answer !== io.answer) {
          throw new Error("Incorrect answer");
        }

        // Do not update the question if it was already solved by someone else before current time
        if (question.solved_at && question.solved_at < solvedAt) {
          return;
        }

        // Update the question as solved
        await tx.question.update({
          where: {
            id: io.questionId,
          },
          data: {
            solved_at: solvedAt,
            solved_by: io.userId,
          },
        });
      },
      {
        isolationLevel: "Serializable", // Ensures strict read/write isolation
        maxWait: 10000,
        timeout: 20000,
      }
    );

    // Fetch the question again to get the updated solved_by
    const question = await prisma.question.findUniqueOrThrow({
      where: {
        id: io.questionId,
      },
    });

    return {
      isWin: question.solved_by === io.userId,
      isSolved: question.solved_at !== null,
    };
  } catch (e) {
    return {
      isWin: false,
      isSolved: false,
      error: e,
    };
  }
}

export async function getQuestion(): Promise<{ question: string; id: string }> {
  let prisma = new PrismaClient();
  let question = await prisma.question.findFirst({
    where: {
      solved_at: null,
    },
    select: {
      question: true,
      id: true,
    },
  });

  if (!question) {
    // Generate a new question if no question is found this will keep the game going
    await generateNewQuestion();
    return await getQuestion();
  }

  return question;
}

async function generateNewQuestion() {
  let prisma = new PrismaClient();
  let operators = ["+", "-", "*", "/"];
  let operator = operators[Math.floor(Math.random() * operators.length)];
  let a = Math.floor(Math.random() * 10);
  let b = Math.floor(Math.random() * 10);
  let question = `What will be (floored) result of ${a} ${operator} ${b}`;
  let answer = Math.floor(eval(`${a} ${operator} ${b}`)).toString();

  let q = await prisma.question.create({
    data: {
      question,
      answer,
    },
  });
  return q;
}

export async function getLeaderboard() {
  let prisma = new PrismaClient();
  let leaderboard = await prisma.question.groupBy({
    by: ["solved_by"],
    where: {
      solved_at: {
        not: null,
      },
      solved_by: {
        not: null,
      },
    },
    _count: {
      solved_by: true,
    },
    orderBy: {
      _count: {
        solved_by: "desc",
      },
    },
    take: 10,
  });

  return leaderboard;
}
