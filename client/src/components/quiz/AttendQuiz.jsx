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
    <div className="md:w-[70%]  w-[90%] h-[90%] m-5 self-start rounded-lg p-5">
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
                {/* <span className="font-thin md:text-sm text-[10px]">
                  {isAttempted && `(prev. best: ${correctScore})`}
                </span> */}
              </h1>
              <div className="flex flex-col  md:text-nowrap md:flex-row">
                <p className="md:text-md   mb-2 md:mb-0 ml-2">
                  <span className="font-thin text-gray-600">
                    Total Questions:
                  </span>

                  <span className="font-semibold">
                    {quiz.numberOfQuestions}
                  </span>
                </p>
                <p className="md:text-md  md:ml-[30%]">
                  <span className="font-thin text-gray-600 ml-2">
                    Total Points:{" "}
                  </span>
                  <span className="font-semibold">{quiz.totalMarks}</span>
                </p>
              </div>
            </div>
            <div
              className={`mt-2 md:mt-0 my-auto mx-auto md:ml-auto border hover:bg-yellow-300 hover:text-black ${
                isAttempted ? "bg-yellow-400" : "bg-white"
              } rounded-xl`}
            >
              <button
                className="text-black md:p-2 p-1 font-semibold "
                onClick={() => handleStartQuiz(indexOfFirstQuiz + index)}
              >
                Solve Challenge
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          className={`px-4 bg-ind hover:bg-violet-500 hover:text-white py-2 border rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className={`px-4 bg-indigo-500 hover:bg-violet-500 text-white hover:text-white py-2 border rounded ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendQuiz;
