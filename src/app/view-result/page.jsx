"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getScoreById } from "../utils/db";
import { motion, AnimatePresence } from "framer-motion";

const ViewResult = () => {
  const searchParams = useSearchParams();
  const entryId = searchParams.get("id");
  const [quizEntry, setQuizEntry] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (entryId) {
      getScoreById(parseInt(entryId, 10)).then(setQuizEntry);
    }
  }, [entryId]);

  if (!quizEntry) {
    return <p className="text-center mt-6 text-gray-500 animate-pulse">Loading result...</p>;
  }

  // Filter answers based on active tab
  const filteredAnswers =
    activeTab === "correct"
      ? quizEntry.answers.filter((item) => item.isCorrect)
      : activeTab === "incorrect"
      ? quizEntry.answers.filter((item) => !item.isCorrect)
      : quizEntry.answers;

  return (
    <div className="p-6 sm:p-8 md:p-12  mx-auto text-white min-h-screen bg-gradient-to-r from-indigo-900 to-blue-900 shadow-xl rounded-lg">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl font-bold mb-4 text-center text-yellow-400 drop-shadow-lg"
      >
        Quiz Result
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-center font-semibold"
      >
        Score:{" "}
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="font-extrabold text-yellow-300"
        >
          {quizEntry.score} / 5
        </motion.span>
      </motion.p>

      {/* Tabbing System */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {["all", "correct", "incorrect"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-base sm:text-lg shadow-md transition-all ${
              activeTab === tab
                ? tab === "correct"
                  ? "bg-green-500 text-white shadow-green-400"
                  : tab === "incorrect"
                  ? "bg-red-500 text-white shadow-red-400"
                  : "bg-blue-500 text-white shadow-blue-400"
                : "bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600"
            }`}
          >
            {tab === "all" ? "All" : tab === "correct" ? "Correct" : "Incorrect"}
          </motion.button>
        ))}
      </div>

      {/* Answer List with Card Flip Animation */}
      <ul className="space-y-6 mt-6">
        <AnimatePresence mode="wait">
          {filteredAnswers.length > 0 ? (
            filteredAnswers.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="p-4 sm:p-5 bg-gray-800 shadow-lg rounded-lg transition-all hover:scale-105"
              >
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400">{item.question}</h3>
                <p
                  className={`font-semibold ${
                    item.isCorrect ? "text-green-400" : "text-red-400"
                  }`}
                >
                  Your Answer: {item.selectedAnswer || "Unattempted"}
                </p>
                <p className="text-blue-400 font-semibold">Correct Answer: {item.correctAnswer}</p>
                <p className="mt-3 text-gray-300 leading-relaxed">{item.explanation}</p>
              </motion.li>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-4 text-red-400 font-semibold animate-pulse"
            >
              No answers in this category.
            </motion.p>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default ViewResult;
