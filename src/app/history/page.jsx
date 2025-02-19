"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveScore, getScores } from "../utils/db";
import { motion } from "framer-motion";

const History = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryScore = searchParams.get("score");
  const [pastScores, setPastScores] = useState([]);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    console.log("Score Query:", queryScore);
    const storedScore = sessionStorage.getItem("score") || queryScore || "0";
    const storedAnswers = JSON.parse(sessionStorage.getItem("answers")) || [];

    setScore(parseInt(storedScore, 10));
    setAnswers(storedAnswers);

    if (!sessionStorage.getItem("scoreSaved")) {
      saveScore(parseInt(storedScore, 10), storedAnswers);
      sessionStorage.setItem("scoreSaved", "true");
    }

    getScores().then(setPastScores);
    setTimeout(() => setAnimateScore(true), 500);
  }, []);

  return (
    <div className="flex flex-col items-center pt-16 min-h-screen px-4 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      {/* Animated Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`text-3xl sm:text-4xl font-extrabold text-center drop-shadow-md ${queryScore === null ? "hidden" : "block"}`}
      >
        🎉 Quiz Completed! 🎉
      </motion.h2>

      {/* Animated Score Display */}
      <motion.p
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.3 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`mt-4 text-2xl sm:text-3xl font-bold ${queryScore === null ? "hidden" : "block"}`}
      >
        Your Score:{" "}
        <motion.span
          animate={{ scale: animateScore ? 1.4 : 1 }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="text-yellow-400 font-extrabold"
        >
          {score} / 5
        </motion.span>
      </motion.p>

      {/* Scoreboard with Floating Cards */}
      <div className="mt-6 w-full max-w-xs sm:max-w-md lg:max-w-lg bg-white bg-opacity-10 backdrop-blur-md shadow-xl rounded-lg p-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4 text-yellow-300">📜 Scoreboard</h3>
        <ul className="divide-y divide-gray-400">
          {pastScores.length > 0 ? (
            pastScores.map((entry, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="py-3 flex flex-col sm:flex-row justify-between items-center px-4 bg-gray-800 bg-opacity-50  shadow-md hover:scale-105 transition-all"
              >
                <span className="text-sm sm:text-md">{entry.date}</span>
                <span className="font-bold text-yellow-300 text-lg">{entry.score} / 5</span>
                <button
                  onClick={() => router.push(`/view-result?id=${entry.id}`)}
                  className="mt-2 sm:mt-0 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-all"
                >
                  View Details
                </button>
              </motion.li>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-gray-300 text-center py-4"
            >
              No past scores yet.
            </motion.p>
          )}
        </ul>
      </div>

      {/* Buttons with Glowing Effect */}
      <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(0, 255, 255, 0.6)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            sessionStorage.removeItem("scoreSaved");
            sessionStorage.removeItem("answers");
            sessionStorage.removeItem("score");
            router.push("/quiz");
          }}
          className="px-6 py-3 bg-cyan-500 text-white rounded-lg shadow-lg font-semibold hover:bg-cyan-600 transition-all w-full sm:w-auto"
        >
          🔄 Try Again
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(255, 165, 0, 0.6)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow-lg font-semibold hover:bg-orange-600 transition-all w-full sm:w-auto"
        >
          🏠 Go Back to Home
        </motion.button>
      </div>
    </div>
  );
};

export default History;
