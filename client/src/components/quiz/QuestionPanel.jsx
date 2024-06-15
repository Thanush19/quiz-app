import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsListCheck, BsArrowLeft, BsArrowRight } from "react-icons/bs"; // Importing icons
import Questions from "./Questions";
import axios from "axios";
import { backend } from "../../../constant";
import { UserContext } from "../../context/userContext";

const QuestionPanel = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { quizId } = useParams();
  const quiz = Questions[quizId];
  const totalQuestions = quiz.questions.length;

  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu anchor
  const [currentQuestion, setCurrentQuestion] = useState(0); // State for current question index
  const [answers, setAnswers] = useState(new Array(totalQuestions).fill("")); // State for storing answers
  const [answeredStatus, setAnsweredStatus] = useState(
    new Array(totalQuestions).fill(false)
  ); // State to track if question is answered

  const [startTime, setStartTime] = useState(new Date()); // State to store quiz start time

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

    // Calculate total time taken
    const endTime = new Date();
    const totalTimeTaken = (endTime - startTime) / 1000; // in seconds

    // Prepare quiz attempt data to be sent to backend
    const quizAttemptData = {
      quiz_name: quiz.testName,
      user_id: user.id, // Replace with actual user ID (e.g., from authentication)
      already_attended: true, // Example value, adjust as needed
      correctly_answered: correctCount,
      wrong_answered: wrongCount,
      average_time_taken: totalTimeTaken / totalQuestions,
      total_questions: totalQuestions,
    };

    try {
      // POST request to save quiz attempt data to backend
      await axios.post(`${backend}/api/quiz-attempts`, quizAttemptData);

      // Navigate to TestResult component with quiz results
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
      <div className="h-[10%] m-4 rounded-xl bg-white flex items-center justify-between px-4 relative">
        {/* Menu Icon */}
        <button
          className="text-gray- bg-blue-100 p-2 rounded-lg mr-3 hover:text-gray-800 focus:outline-none relative"
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
                    className="appearance-none w-4 h-4 rounded-full border ml-8 border-gray-300 checked:bg-green-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                </div>
              ))}
            </div>
          )}
        </button>

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
          className="ml-auto text-gray-600  bg-blue-100 p-4 rounded-xl hover:text-gray-800 focus:outline-none"
          onClick={handleEndTest}
        >
          End Test
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-2 ">
        <div className="h-full flex items-center justify-center">
          {/* Questions Section */}
          <div className="w-[50%] h-[95%] bg-white p-10 ">
            <h2 className="text-lg font-bold">
              Question No: {currentQuestion + 1}
            </h2>
            <h2 className="text-lg font-semibold">
              {quiz.questions[currentQuestion].question}
            </h2>
          </div>

          {/* Answer Section */}
          <div className="bg-white ml-4 w-[70%] h-[95%] flex p-6 ">
            <ul className="mt-[1rem]">
              <h2 className="text-lg font-bold">Select the Correct answer</h2>

              {quiz.questions[currentQuestion].options.map((option, oIndex) => (
                <li
                  key={oIndex}
                  className="ml-4 mb-2 border border-gray-300 rounded-2xl p-2 mt-6"
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
      <div className="h-[10%] m-4  rounded-xl bg-white flex items-center justify-between px-4 relative">
        {/* Previous Button */}
        {currentQuestion > 0 && (
          <button
            className="text-violet-600 border flex bg-blue-100 rounded-2xl p-4 hover:text-gray-800 focus:outline-none"
            onClick={handlePreviousQuestion}
          >
            <spa>
              <BsArrowLeft className="h-5 w-5 ml-1" />
            </spa>
          </button>
        )}

        {/* Submit Button */}
        <button
          className="text-violet-600 border flex bg-blue-100 rounded-2xl p-4 hover:text-gray-800 focus:outline-none"
          onClick={handleSubmitQuiz}
        >
          Save & Submit
        </button>

        {/* Next Button */}
        {currentQuestion < totalQuestions - 1 && (
          <button
            className="text-violet-600 border flex bg-blue-100 rounded-2xl p-4 hover:text-gray-800 focus:outline-none"
            onClick={handleNextQuestion}
          >
            <spa>
              <BsArrowRight className="h-5 w-5 ml-1" />
            </spa>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPanel;
