"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      {/* Animated Heading */}
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-8 drop-shadow-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to the <br />
        <span className="text-yellow-400">Interactive Quiz</span>
      </motion.h1>

      {/* Buttons Section */}
      <div className="w-full max-w-xs sm:max-w-md flex flex-col space-y-5">
        {/* Start Quiz Button */}
        <motion.button
          className="relative w-full px-6 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-yellow-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/quiz")}
        >
          Start Quiz
          {/* Button Shine Effect */}
          <span className="absolute inset-0 bg-white opacity-10 rounded-lg"></span>
        </motion.button>

        {/* View Scoreboard Button */}
        <motion.button
          className="relative w-full px-6 py-4 bg-gray-800 text-white font-bold rounded-lg text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/history")}
        >
          View Scoreboard
          {/* Button Shine Effect */}
          <span className="absolute inset-0 bg-white opacity-5 rounded-lg"></span>
        </motion.button>
      </div>
    </div>
  );
}
