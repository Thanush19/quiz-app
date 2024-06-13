import React, { useState } from "react";

const AttendQuiz = () => {
  const handleStartQuiz = (quizId) => {
    // Redirect to /test/:quizId route
    // For simplicity, assuming quizzes have unique ids based on their index
    // quizId is the index of the quiz in the quizzes array
    window.location.href = `/test/${quizId}`;
  };
  const quizzes = [
    {
      testName: "Math Quiz",
      numberOfQuestions: 10,
      totalMarks: 100,
      attended: true, // Indicate if attended
    },
    {
      testName: "Science Quiz",
      numberOfQuestions: 10,
      totalMarks: 125,
      attended: true, // Indicate if attended
    },
    {
      testName: "History Quiz",
      numberOfQuestions: 10,
      totalMarks: 75,
      attended: false, // Indicate if not attended
    },
    {
      testName: "Geography Quiz",
      numberOfQuestions: 10,
      totalMarks: 50,
      attended: true, // Indicate if attended
    },
    {
      testName: "Literature Quiz",
      numberOfQuestions: 10,
      totalMarks: 150,
      attended: false, // Indicate if not attended
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 4;

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  const getBorderColor = (attended) => {
    return attended ? "border-green-500" : "border-orange-500";
  };

  const status = (attended) => {
    return attended ? "Already Attended" : "Not yet Attended";
  };

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
      {quizzes.map((quiz, index) => (
        <div
          key={index}
          className="mb-4 p-4 border-l-4 flex bg-white rounded-lg border-orange-500"
        >
          <div className="w-[60%]">
            <h1 className="text-2xl font-bold mb-2">
              {quiz.testName}
              <span className="text-sm font-light ml-4">
                {quiz.attended ? "Already Attended" : "Not yet Attended"}
              </span>{" "}
            </h1>
            <div className="flex">
              <p className="text-lg ml-2">
                Number of Questions: {quiz.numberOfQuestions}
              </p>
              <p className="text-lg ml-2">Total Marks: {quiz.totalMarks}</p>
            </div>
          </div>
          <div className="my-auto mx-auto border hover:bg-yellow-300 hover:text-black border-violet-500 rounded-lg">
            <button
              className="text-violet-500 p-2"
              onClick={() => handleStartQuiz(index)}
            >
              Submit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendQuiz;
