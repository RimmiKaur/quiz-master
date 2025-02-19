import { motion } from "framer-motion";

const QuizQuestion = ({ question, options, selectedOption, onAnswer, submitted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 md:p-8 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-center transition-transform duration-300 hover:scale-[1.03] relative overflow-hidden"
    >
      {/* Floating Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-400 to-transparent opacity-10 blur-lg"></div>

      {/* Question Text */}
      <motion.h3
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-bold text-gray-900 dark:text-white mb-5 leading-relaxed"
      >
        {question}
      </motion.h3>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => onAnswer(option)}
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 8px rgba(0, 255, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className={`relative block w-full px-6 py-3 text-lg rounded-md border transition-all duration-300 font-medium shadow-md tracking-wide
              ${
                submitted
                  ? "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 cursor-not-allowed"
                  : selectedOption === option
                  ? "border-blue-500 text-blue-500 bg-blue-100 shadow-md"
                  : "bg-white border-gray-300 text-gray-900 dark:bg-gray-900 dark:text-white hover:bg-gray-200 hover:shadow-lg"
              }`}
            disabled={submitted} // Disable re-selection after submission
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
