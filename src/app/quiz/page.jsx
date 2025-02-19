"use client";
import { Suspense } from "react";
import Quizes from "../components/Quizes";

const Quiz = () => {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Loading quiz...</div>}>
      <Quizes/>
    </Suspense>
  );
};

export default Quiz;
