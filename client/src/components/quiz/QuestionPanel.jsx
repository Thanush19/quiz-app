import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BsListCheck,
  BsArrowLeft,
  BsArrowRight,
  BsClock,
} from "react-icons/bs"; // Importing icons
import Questions from "./Questions";
import axios from "axios";
import { backend } from "../../../constant";
import { UserContext } from "../../context/userContext";
import Modal from "./end test/Model";

const QuestionPanel = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { quizId } = useParams();
  const quiz = Questions[quizId];
  const totalQuestions = quiz.questions.length;
  const [openModal, setOpenModal] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu anchor
  const [currentQuestion, setCurrentQuestion] = useState(0); // State for current question index
  const [answers, setAnswers] = useState(new Array(totalQuestions).fill("")); // State for storing answers
  const [answeredStatus, setAnsweredStatus] = useState(
    new Array(totalQuestions).fill(false)
  ); // State to track if question is answered

  const [startTime, setStartTime] = useState(new Date()); // State to store quiz start time
  const [elapsedTime, setElapsedTime] = useState(0); // State to store elapsed time in seconds

  // Timer function to update elapsed time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const secondsElapsed = Math.floor((new Date() - startTime) / 1000);
      setElapsedTime(secondsElapsed);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [startTime]);

  const handleMenuClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget); // Toggle dropdown menu
  };

  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    const questionIndex = parseInt(name.split("_")[1], 10);
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);

    // Update answered status for this question
    const newAnsweredStatus = [...answeredStatus];
    newAnsweredStatus[questionIndex] = true;
    setAnsweredStatus(newAnsweredStatus);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleEndTest = () => {
    const confirmEndTest = window.confirm(
      "Are you sure you want to end the test?"
    );

    if (confirmEndTest) {
      // Perform cleanup or additional actions if needed before navigating away

      // Redirect to "/"
      navigate("/");
    }
  };

  const handleSubmitQuiz = async () => {
    // Calculate correct and wrong answers
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctCount++;
      } else if (answer === "") {
        unattemptedCount++;
      } else {
        wrongCount++;
      }
    });

    const endTime = new Date();
    const totalTimeTaken = (endTime - startTime) / 1000;

    // Prepare quiz attempt data to be sent to backend
    const quizAttemptData = {
      quiz_name: quiz.testName,
      user_id: user.id,
      already_attended: true,
      correctly_answered: correctCount,
      wrong_answered: wrongCount,
      average_time_taken: totalTimeTaken / totalQuestions,
      total_questions: totalQuestions,
    };

    try {
      await axios.post(`${backend}/api/quiz-attempts`, quizAttemptData);

      navigate(`/quiz/${quizId}/result`, {
        state: {
          totalQuestions,
          correctCount,
          wrongCount,
          unattemptedCount,
          testName: quiz.testName,
          totalTimeTaken: totalTimeTaken.toFixed(2),
          averageTimePerQuestion: (totalTimeTaken / totalQuestions).toFixed(2),
          timeTakenForEachQuestion: quiz.questions.map((_, index) => ({
            questionNumber: index + 1,
            timeTaken: ((endTime - startTime) / 1000).toFixed(2),
          })),
        },
      });
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      <div className="h-[15%] md:h-[10%] m-4 rounded-xl bg-white flex items-center justify-between px-4 relative">
        {/* Menu Icon */}
        <button
          className="text-gray- bg-blue-100 p-3 m-3 rounded-lg mr-3 hover:text-gray-800 focus:outline-none relative"
          onClick={handleMenuClick}
        >
          <BsListCheck className="h-6 w-6" />
          {anchorEl && (
            <div className="absolute bg-white mt-2 shadow-lg rounded-lg border border-gray-200">
              {quiz.questions.map((question, index) => (
                <div key={index} className="flex items-center p-2 md:w-[8rem]">
                  <label
                    htmlFor={`question_${index}`}
                    className={`ml-1 cursor-pointer ${
                      answeredStatus[index] ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    <span className="font-bold">{index + 1} Mcq</span>
                  </label>
                  <input
                    type="checkbox"
                    id={`question_${index}`}
                    checked={answeredStatus[index]}
                    className="appearance-none w-4 h-4 m-3 p-3 rounded-full border ml-8 border-gray-300 checked:bg-green-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
              ))}
            </div>
          )}
        </button>

        {/* Timer */}
        <div className="flex flex-grow items-center justify-center">
          {" "}
          {/* Added flex-grow to take remaining space */}
          <BsClock className="h-6 w-6 text-gray-600 mr-2" />
          <span className="text-gray-600">{formatTime(elapsedTime)}</span>
        </div>

        {/* Previous Button */}
        {currentQuestion > 0 && (
          <button
            className="text-gray-600 hover:text-gray-800 bg-blue-100 p-3 rounded-xl focus:outline-none"
            onClick={handlePreviousQuestion}
          >
            <BsArrowLeft className="h-5 w-5 ml-1" />
          </button>
        )}

        {/* End Test Button */}
        <button
          className="ml-auto text-gray-600  bg-blue-100 p-2 rounded-xl hover:text-gray-800 focus:outline-none"
          onClick={handleEndTest}
        >
          End Test
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-2 ">
        <div className="h-full flex items-center md:flex-row flex-col justify-center">
          {/* Questions Section */}
          <div className="md:w-[50%] md:h-[95%] w-[80%] h-[30%] mb-2 rounded-xl bg-white p-10 ">
            <h2 className="text-lg font-bold">
              Question No: {currentQuestion + 1}
            </h2>
            <h2 className="text-lg font-semibold">
              {quiz.questions[currentQuestion].question}
            </h2>
          </div>

          {/* Answer Section */}
          <div className="md:w-[50%] md:ml-4 md:h-[95%] w-[80%] h-[60%] mb-2 rounded-xl bg-white p-10 ">
            <ul className="md:mt-[1rem]">
              <h2 className="text-lg font-bold">Select the Correct answer</h2>

              {quiz.questions[currentQuestion].options.map((option, oIndex) => (
                <li
                  key={oIndex}
                  className="ml-4 mb-2 border border-gray-300 rounded-2xl p-2 md:mt-6"
                >
                  <label className="">
                    <input
                      type="radio"
                      name={`question_${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === option}
                      onChange={handleOptionChange}
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[15%] md:h-[10%]  m-4  rounded-xl bg-white flex items-center justify-between px-4 relative">
        {/* Previous Button */}
        {currentQuestion > 0 && (
          <button
            className="text-violet-600 border flex bg-blue-100 rounded-2xl m-1 hover:text-gray-800 focus:outline-none"
            onClick={handlePreviousQuestion}
          >
            <span>
              <BsArrowLeft className="h-5 w-5 ml-1" />
            </span>
          </button>
        )}

        {/* Submit Button */}
        <button
          className="text-gray- bg-blue-100 p-3 md :rounded-lg mr-3 hover:text-gray-800 focus:outline-none relative"
          onClick={handleSubmitQuiz}
        >
          Save & Submit
        </button>

        {/* Next Button */}
        {currentQuestion < totalQuestions - 1 && (
          <button
            className="text-violet-600 border flex bg-blue-100 rounded-2xl m-1 hover:text-gray-800 focus:outline-none"
            onClick={handleNextQuestion}
          >
            <span>
              <BsArrowRight className="h-5 w-5 ml-1" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPanel;

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
