"use client";
import { Suspense } from "react";
import Result from "../components/Result";

const ViewResult = () => {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Loading ViewResult...</div>}>
      <Result />
    </Suspense>
  );
};

export default ViewResult;
