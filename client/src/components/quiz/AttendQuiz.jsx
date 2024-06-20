import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { backend } from "../../../constant.js";
import axios from "axios";

const AttendQuiz = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const handleStartQuiz = (quizId) => {
    navigate(`/test/${quizId}`);
  };
  const [loading, setLoading] = useState(true);
  const [quizAttempts, setQuizAttempts] = useState([]);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        const response = await axios.get(
          `${backend}/api/quiz-attempts/${user.id}`
        );
        setQuizAttempts(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz attempts:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchQuizAttempts();
    }
  }, [user]);

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
    <div className="w-[70%] h-[90%] m-5 self-start rounded-lg p-5">
      {currentQuizzes.map((quiz, index) => {
        const attempt = quizAttempts.find(
          (attempt) =>
            attempt.quiz_name === quiz.testName && attempt.already_attended
        );

        const isAttempted = attempt !== undefined;
        const correctScore = isAttempted ? attempt.correctly_answered : 0;

        return (
          <div
            key={index}
            className={`mb-4 p-4 flex flex-col md:flex-row rounded-lg  border
                      ${
                        isAttempted
                          ? "border-yellow-200 bg-amber-50"
                          : "bg-white hover:border-yellow-200 hover:bg-amber-50 "
                      } `}
          >
            <div className="w-full md:w-[60%]">
              <h1 className="text-xl font-semibold mb-2">
                {quiz.testName}{" "}
                <span className="font-thin text-sm">
                  {isAttempted && `(prev. best: ${correctScore})`}
                </span>
              </h1>
              <div className="flex flex-col md:flex-row">
                <p className="md:text-md  mb-2 md:mb-0 ml-2">
                  <span className="font-thin"> Total Questions: </span>

                  <span className="font-semibold">
                    {quiz.numberOfQuestions}
                  </span>
                </p>
                <p className="md:text-md  ml-2">
                  <span className="font-thin"> Total Marks: </span>
                  <span className="font-semibold">{quiz.totalMarks}</span>
                </p>
              </div>
            </div>
            <div
              className={`mt-2 md:mt-0 my-auto mx-auto md:ml-auto border hover:bg-yellow-300 hover:text-black ${
                isAttempted ? "bg-yellow-400" : "bg-white"
              } rounded-lg`}
            >
              <button
                className="text-gray-500 p-2 font-semibold "
                onClick={() => handleStartQuiz(indexOfFirstQuiz + index)}
              >
                Solve Challenge
              </button>
            </div>
          </div>
        );
      })}

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
            className="px-4 bg-violet-700 hover:bg-violet-500 text-white hover:text-white py-2 border rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendQuiz;
