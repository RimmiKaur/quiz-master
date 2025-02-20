"use client";
import { useState, useEffect } from "react";
import QuizQuestion from "../components/QuizQuestion";
import Timer from "../components/Timer";
import Modal from "../components/Modal";
import { useRouter } from "next/navigation";
import { quizData } from "../data/quizData";
import { saveScore, getScores } from "../utils/db"; 
import { motion, AnimatePresence } from "framer-motion";

const Quizes = () => {
  const router = useRouter();
  const [score, setScore] = useState(0); // Start with 0 instead of reading sessionStorage
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userInput, setUserInput] = useState(""); 
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [timerKey, setTimerKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures component is mounted in browser
    const storedScore = sessionStorage.getItem("score");
    if (storedScore) setScore(parseInt(storedScore, 10));
  }, []);

  useEffect(() => {
    if (isClient) {
      sessionStorage.setItem("score", score.toString());
    }
  }, [score, isClient]);

  const currentQuestion = quizData[currentIndex];

  const handleAnswer = (answer) => {
    if (currentQuestion.type === "mcq") {
      setSelectedOption(answer);
    } else {
      setUserInput(answer);
    }
    setButtonText("Submit");
  };

  const handleSubmit = () => {
    if (
      (currentQuestion.type === "mcq" && !selectedOption) ||
      (currentQuestion.type === "text" && !userInput) ||
      submitted
    )
      return;

    setSubmitted(true);
    const correctAnswer = currentQuestion.answer;
    const isAnswerCorrect =
      currentQuestion.type === "mcq"
        ? selectedOption === correctAnswer
        : userInput.trim() === correctAnswer;

    setIsCorrect(isAnswerCorrect);
    setShowModal(true);

    const newAnswer = {
      question: currentQuestion.question,
      selectedAnswer: currentQuestion.type === "mcq" ? selectedOption : userInput,
      correctAnswer,
      isCorrect: isAnswerCorrect,
      explanation: currentQuestion.explanation,
    };

    if (isClient) {
      const storedAnswers = JSON.parse(sessionStorage.getItem("answers")) || [];
      storedAnswers.push(newAnswer);
      sessionStorage.setItem("answers", JSON.stringify(storedAnswers));
    }

    if (isAnswerCorrect) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (isClient) {
          sessionStorage.setItem("score", newScore.toString());
        }
        return newScore;
      });
    }
  };

  const handleNextQuestion = async () => {
    setShowModal(false);
    setShowTimerModal(false);
    setSelectedOption(null);
    setUserInput(""); 
    setIsCorrect(null);
    setSubmitted(false);
    setButtonText("Submit");

    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimerKey((prevKey) => prevKey + 1);
    } else {
      const finalScore = score;
      const finalAnswers = JSON.parse(sessionStorage.getItem("answers")) || [];

      if (isClient && !sessionStorage.getItem("scoreSaved")) {
        const previousScores = await getScores();
        const alreadySaved = previousScores.some(
          (entry) => entry.score === finalScore && JSON.stringify(entry.answers) === JSON.stringify(finalAnswers)
        );
        if ((!previousScores || previousScores.length === 0) && finalAnswers.length === 0) {
            sessionStorage.removeItem("scoreSaved");
            sessionStorage.removeItem("answers");
            sessionStorage.removeItem("score");
          }

        if (!alreadySaved) {
          await saveScore(finalScore, finalAnswers);
          sessionStorage.setItem("scoreSaved", "true");
        }
      }

      router.push(`/history?score=${finalScore}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showModal) {
        setShowTimerModal(true);
        setTimeout(handleNextQuestion, 2000);
        
      }
    }, 30000); 

    return () => clearTimeout(timer);
  }, [currentIndex, showModal]);

  return (
    <div className="flex  flex-col items-center p-6 bg-gradient-to-br from-blue-900 to-purple-900 min-h-screen text-white">
      <div className="w-full relative max-w-lg bg-gray-700 rounded-full h-2 mb-4">
        <div
          className="h-2 bg-yellow-400 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }}
        ></div>
        <div className="absolute top-8 right-0 bg-black px-5 py-2">
            Score: {score} /10
        </div>
      </div>

      <Timer key={timerKey} duration={30} onTimeUp={() => setShowTimerModal(true)} />

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
            question={currentQuestion.question}
            type={currentQuestion.type}
            options={currentQuestion.options}
            selectedOption={selectedOption}
            userInput={userInput}
            setUserInput={setUserInput}
            onAnswer={handleAnswer}
            questionType={currentQuestion.category}
            />
        </motion.div>
      </AnimatePresence>

      <motion.button
        disabled={
          (currentQuestion.type === "mcq" && !selectedOption) ||
          (currentQuestion.type === "text" && !userInput) ||
          submitted
        }
        onClick={handleSubmit}
        className={`mt-4 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 shadow-lg ${
          (currentQuestion.type === "mcq" && selectedOption) ||
          (currentQuestion.type === "text" && userInput)
            ? "bg-yellow-500 hover:bg-yellow-600 hover:scale-105"
            : "bg-gray-500 cursor-not-allowed"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {buttonText}
      </motion.button>

      {showModal && (
        <Modal
          title={isCorrect ? "Correct!" : "Incorrect!"}
          message={
            <>
              <span>The correct answer is: <strong>{currentQuestion.answer}</strong></span>
              <br />
              <span className="font-bold">{currentQuestion.explanation}</span>
            </>
          }
          onClose={handleNextQuestion}
        />
      )}

      {showTimerModal && (
        <Modal title="Time's Up!" message="Moving to the next question..." onClose={handleNextQuestion} />
      )}
    </div>
  );
};

export default Quizes;
