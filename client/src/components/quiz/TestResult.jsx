import React from "react";
import { useLocation } from "react-router-dom";

const TestResult = () => {
  const location = useLocation();
  const {
    totalQuestions,
    correctCount,
    wrongCount,
    unattemptedCount,
    testName,
    totalTimeTaken,
    averageTimePerQuestion,
    timeTakenForEachQuestion,
  } = location.state;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Quiz Results: {testName}</h1>
      <p>Total Questions: {totalQuestions}</p>
      <p>Correct Answers: {correctCount}</p>
      <p>Wrong Answers: {wrongCount}</p>
      <p>Unattempted Questions: {unattemptedCount}</p>
      <p>Total Time Taken: {totalTimeTaken} seconds</p>
      <p>Average Time Per Question: {averageTimePerQuestion} seconds</p>
      <h2>Time Taken for Each Question:</h2>
      <ul>
        {timeTakenForEachQuestion.map((info) => (
          <li key={info.questionNumber}>
            Question {info.questionNumber}: {info.timeTaken} seconds
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestResult;
