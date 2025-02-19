const QuizQuestion = ({ 
  question, 
  options, 
  selectedOption, 
  onAnswer, 
  userInput, 
  setUserInput, 
  questionType 
}) => {
  console.log("dsfsdfdsfsdfsdfdf", questionType);
  return (
    <div className="p-6 md:p-8 border border-gray-300 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-center transition-transform duration-300 hover:scale-[1.03]">
      {/* Question Text */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 leading-relaxed">
        {question}
      </h3>

      {/* If MCQ, show options */}
      {questionType === "Multiple-Choice" ? (
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              className={`block w-full px-6 py-3 text-lg rounded-md border transition-all duration-300 font-medium shadow-md tracking-wide
                ${selectedOption === option ? "border-blue-500 text-blue-500 bg-blue-100 shadow-md" : "bg-white border-gray-300 text-gray-900 dark:bg-gray-900 dark:text-white hover:bg-gray-200 hover:shadow-lg"}`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        // If open-ended question, show text input
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 border border-gray-400 rounded-md text-black focus:ring focus:ring-blue-500"
        />
      )}
    </div>
  );
};

export default QuizQuestion;
