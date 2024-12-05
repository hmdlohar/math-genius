"use client";

import {
  getQuestion,
  recordAnswer,
  getLeaderboard,
} from "./api/QuestionService";
import { useState } from "react";
import AuthGuard from "../components/auth/AuthGuard";
import { useAuth } from "../components/auth/AuthContext";
import useAPI from "@/hooks/useAPI";
import ErrorPlaceHolder from "@/common/ErrorPlaceHolder";
import Loading from "@/common/Loading";
import LeaderBoard from "./LeaderBoard";

export default function QuestionPage() {
  const [answer, setAnswer] = useState("");
  const { username } = useAuth();
  const question = useAPI(
    () => {
      return getQuestion();
    },
    { fetchOnMount: true }
  );
  const api = useAPI(async () => {
    if (!question.data) {
      throw new Error("No question found");
    }
    let result = await recordAnswer({
      questionId: question.data.id,
      answer: answer,
      userId: username || "",
      clientTimestamp: Date.now(),
    });

    return result;
  });
  

  return (
    <>
      {question.loading && (
        <div className="flex justify-center items-center h-full">
          <Loading />
        </div>
      )}
      {question.error && <ErrorPlaceHolder error={question.error} />}
      {question.data && (
        <>
          <p className="text-md text-gray-600 mb-8">
            Answer the question below before anyone else and win a prize! Be
            quick otherwise your answer may not be counted.
          </p>
          <p className="text-xl font-semibold text-gray-800 mb-6">
            {question.data?.question}
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button
              className={`px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors 
                        ${
                          !answer || api.loading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
              onClick={async () => {
                api.call();
              }}
              disabled={!answer || api.loading || api.data?.isSolved}
            >
              Submit
            </button>
            {api.loading && <Loading />}
          </div>
          {api.data && (
            <div>
              {api.data?.isWin ? (
                <p className="text-green-600 font-semibold">
                  You won! You are the first to solve the question.
                </p>
              ) : (
                <p className="text-red-600 font-semibold">
                  Oops! Someone was faster.
                </p>
              )}
              {api.data?.isSolved && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      question.call();
                      api.reset();
                      setAnswer("");
                    }}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Try Another Question
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <div>{api.error && <ErrorPlaceHolder error={api.error} />}</div>
      <LeaderBoard />
    </>
  );
}
