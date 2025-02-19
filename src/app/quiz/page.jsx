"use client";
import { useState, useEffect } from "react";
import QuizQuestion from "../components/QuizQuestion";
import Timer from "../components/Timer";
import Modal from "../components/Modal";
import { useRouter } from "next/navigation";
import { quizData } from "../data/quizData";
import { saveScore, getScores } from "../utils/db"; // Import IndexedDB functions
import { motion, AnimatePresence } from "framer-motion";

const Quiz = () => {
  const [score, setScore] = useState(parseInt(sessionStorage.getItem("score"), 10) || 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [timerKey, setTimerKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  // Sync score with sessionStorage
  useEffect(() => {
    sessionStorage.setItem("score", score.toString());
  }, [score]);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    setButtonText("Submit"); // Reset button text when new answer selected
  };

  const handleSubmit = () => {
    if (!selectedOption || submitted) return; // Prevent duplicate submissions

    setSubmitted(true);
    const correctAnswer = quizData[currentIndex].answer;
    const isAnswerCorrect = selectedOption === correctAnswer;

    setIsCorrect(isAnswerCorrect);
    setShowModal(true); // Show explanation modal

    const newAnswer = {
      question: quizData[currentIndex].question,
      selectedAnswer: selectedOption,
      correctAnswer,
      isCorrect: isAnswerCorrect,
      explanation: quizData[currentIndex].explanation,
    };

    const storedAnswers = JSON.parse(sessionStorage.getItem("answers")) || [];
    storedAnswers.push(newAnswer);
    sessionStorage.setItem("answers", JSON.stringify(storedAnswers));

    if (isAnswerCorrect) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        sessionStorage.setItem("score", newScore.toString());
        return newScore;
      });
    }
  };

  const handleNextQuestion = async () => {
    setShowModal(false);
    setShowTimerModal(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setSubmitted(false); // Reset submission state
    setButtonText("Submit");

    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimerKey((prevKey) => prevKey + 1);
    } else {
      const finalScore = parseInt(sessionStorage.getItem("score"), 10) || 0;
      const finalAnswers = JSON.parse(sessionStorage.getItem("answers")) || [];

      // ✅ Prevent Duplicate Entry
      if (!sessionStorage.getItem("scoreSaved")) {
        const previousScores = await getScores();
        const alreadySaved = previousScores.some(
          (entry) => entry.score === finalScore && JSON.stringify(entry.answers) === JSON.stringify(finalAnswers)
        );

        if (!alreadySaved) {
          await saveScore(finalScore, finalAnswers);
          sessionStorage.setItem("scoreSaved", "true"); // Mark as saved
        }
      }

      router.push(`/history?score=${finalScore}`);
    }
  };

  // Automatically move to the next question when the timer runs out
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showModal) {
        setShowTimerModal(true);
        setTimeout(handleNextQuestion, 2000);
      }
    }, 30000); // 30s timer

    return () => clearTimeout(timer);
  }, [currentIndex, showModal]);

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen text-white">
      {/* Progress Bar */}
      <div className="w-full max-w-lg bg-gray-700 rounded-full h-2 mb-4">
        <div
          className="h-2 bg-yellow-400 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }}
        ></div>
      </div>

      {/* Timer */}
      <Timer key={timerKey} duration={30} onTimeUp={() => setShowTimerModal(true)} />

      {/* Quiz Question with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <QuizQuestion
            question={quizData[currentIndex].question}
            options={quizData[currentIndex].options}
            correctAnswer={quizData[currentIndex].answer}
            selectedOption={selectedOption}
            isCorrect={submitted ? isCorrect : null} // Show color only after submission
            onAnswer={handleAnswer}
          />
        </motion.div>
      </AnimatePresence>

      {/* Submit Button with Animation */}
      <motion.button
        disabled={!selectedOption || submitted} // Disable after submission
        onClick={handleSubmit}
        className={`mt-4 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 shadow-lg ${
          selectedOption ? "bg-yellow-500 hover:bg-yellow-600 hover:scale-105" : "bg-gray-500 cursor-not-allowed"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {buttonText}
      </motion.button>

      {/* Modals */}
      {showModal && (
        <Modal
          title={isCorrect ? "Correct!" : "Incorrect!"}
          message={`The correct answer is: ${quizData[currentIndex].answer}. Explanation: ${quizData[currentIndex].explanation}`}
          onClose={handleNextQuestion}
        />
      )}

      {showTimerModal && (
        <Modal title="Time's Up!" message="Moving to the next question..." onClose={handleNextQuestion} />
      )}
    </div>
  );
};

export default Quiz;
