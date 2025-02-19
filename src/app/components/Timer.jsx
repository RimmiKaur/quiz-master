import { useEffect, useState } from "react";

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [percentage, setPercentage] = useState(100); // For circular progress

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      setPercentage((timeLeft / duration) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Circular Progress */}
      <svg className="absolute transform -rotate-90" width="100" height="100">
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="25"
          stroke="lightgray"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r="25"
          stroke={timeLeft < 10 ? "red" : "#3b82f6"} // Red color for last 10s
          strokeWidth="8"
          fill="none"
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * percentage) / 100}
          strokeLinecap="round"
          transition="stroke-dashoffset 0.5s ease-in-out"
        />
      </svg>

      {/* Timer Text */}
      <span
        className={`absolute text-xl font-bold ${
          timeLeft < 10 ? "text-red-500" : "text-blue-500"
        }`}
      >
        {timeLeft}s
      </span>
    </div>
  );
};

export default Timer;
