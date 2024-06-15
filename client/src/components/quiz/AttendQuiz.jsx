import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AttendQuiz = () => {
  const navigate = useNavigate();

  const handleStartQuiz = (quizId) => {
    // Redirect to /test/:quizId route using react-router's navigate function
    navigate(`/test/${quizId}`);
  };

  const quizzes = [
    {
      testName: "Math Quiz",
      numberOfQuestions: 10,
      totalMarks: 100,
    },
    {
      testName: "Science Quiz",
      numberOfQuestions: 10,
      totalMarks: 100,
    },
    {
      testName: "History Quiz",
      numberOfQuestions: 10,
      totalMarks: 100,
    },
    {
      testName: "Geography Quiz",
      numberOfQuestions: 10,
      totalMarks: 100,
    },
    {
      testName: "Literature Quiz",
      numberOfQuestions: 10,
      totalMarks: 100,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 3;

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-[95%] h-[90%] m-5 self-start rounded-lg p-5">
      {currentQuizzes.map((quiz, index) => (
        <div
          key={index}
          className="mb-4 p-4 flex flex-col md:flex-row bg-white rounded-lg border-l-4 border-violet-500"
        >
          <div className="w-full md:w-[60%]">
            <h1 className="text-2xl font-bold mb-2">{quiz.testName}</h1>
            <div className="flex flex-col md:flex-row">
              <p className="md:text-lg font-semibold mb-2 md:mb-0 ml-2">
                Total Questions: {quiz.numberOfQuestions}
              </p>
              <p className="md:text-lg font-semibold ml-2">
                Total Marks: {quiz.totalMarks}
              </p>
            </div>
          </div>
          <div className="mt-2 md:mt-0 my-auto mx-auto md:ml-auto border hover:bg-yellow-400 hover:text-black rounded-lg">
            <button
              className="text-violet-500 p-2"
              onClick={() => handleStartQuiz(indexOfFirstQuiz + index)}
            >
              Solve Challenge
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        {currentPage > 1 && (
          <button
            onClick={handlePrevious}
            className="px-4 bg-purple-500 hover:bg-violet-500 hover:text-white py-2 border rounded"
          >
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={handleNext}
            className="px-4 bg-purple-500 hover:bg-violet-500 hover:text-white py-2 border rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendQuiz;
