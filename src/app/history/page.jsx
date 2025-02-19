"use client";
import { Suspense } from "react";
import ScoreBoard from "../components/ScoreBoard";

const History = () => {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Loading history...</div>}>
      <ScoreBoard />
    </Suspense>
  );
};

export default History;
