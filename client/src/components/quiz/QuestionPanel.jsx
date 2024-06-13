import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsListCheck } from "react-icons/bs"; // Importing the BsListCheck icon from React Icons
import Questions from "./Questions";

const QuestionPanel = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const quiz = Questions[quizId];
  const totalQuestions = quiz.questions.length;

  const [showMenu, setShowMenu] = useState(false); // State for menu visibility
  const [currentQuestion, setCurrentQuestion] = useState(0); // State for current question index
  const [answers, setAnswers] = useState(new Array(totalQuestions).fill("")); // State for storing answers
  const [startTime, setStartTime] = useState(new Date()); // State to store quiz start time
  const [endTime, setEndTime] = useState(null); // State to store quiz end time

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    const questionIndex = parseInt(name.split("_")[1], 10);
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
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

  const handleSubmitQuiz = () => {
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
    setEndTime(endTime);
    const totalTimeTaken = (endTime - startTime) / 1000; // in seconds

    // Calculate time taken for each question
    const timeTakenForEachQuestion = quiz.questions.map((_, index) => {
      const questionStartTime = startTime.getTime();
      const questionEndTime = endTime.getTime();
      const timeTaken = (questionEndTime - questionStartTime) / 1000; // in seconds
      return {
        questionNumber: index + 1,
        timeTaken: timeTaken.toFixed(2), // Round to 2 decimal places
      };
    });

    // Calculate average time per question
    const averageTimePerQuestion = totalTimeTaken / totalQuestions;

    // Navigate to TestResult component with quiz results
    navigate(`/quiz/${quizId}/result`, {
      state: {
        totalQuestions,
        correctCount,
        wrongCount,
        unattemptedCount,
        testName: quiz.testName,
        totalTimeTaken: totalTimeTaken.toFixed(2),
        averageTimePerQuestion: averageTimePerQuestion.toFixed(2),
        timeTakenForEachQuestion,
      },
    });
  };

  return (
    <>
      <div className="w-full h-16 bg-gray-100 flex items-center justify-between px-4">
        {/* Menu Icon */}
        <button
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={toggleMenu}
        >
          <BsListCheck className="h-6 w-6" /> {/* Using BsListCheck icon */}
        </button>

        {/* Menu Content */}
        {showMenu && (
          <div className="ml-2 flex items-center space-x-2">
            {quiz.questions.map((question, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`question_${index}`}
                  checked={answers[index] !== ""}
                  className="rounded-full h-4 w-4 border-gray-300 focus:ring-gray-400"
                  readOnly
                />
                <label
                  htmlFor={`question_${index}`}
                  className="ml-1 cursor-pointer"
                >
                  {index + 1}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="w-[95%] h-[90%] m-5 self-start rounded-lg p-5">
        <h1 className="text-3xl font-bold mb-4">{quiz.testName}</h1>
        <div className="h-screen flex items-center justify-center">
          {/* Questions Section */}
          <div className="w-[40%] h-[80%] bg-white ">
            <h2 className="text-lg font-bold">
              Question No: {currentQuestion + 1}
            </h2>
            <h2 className="text-lg font-semibold">
              {quiz.questions[currentQuestion].question}
            </h2>
          </div>

          {/* Answer Section */}
          <div className="bg-white ml-4 w-[70%] h-[80%] flex justify-center items-center">
            <ul className="mt-[10%]">
              <h1>Select the correct answer</h1>

              {quiz.questions[currentQuestion].options.map((option, oIndex) => (
                <li key={oIndex} className="ml-4 mb-2">
                  <label className="flex items-center">
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
      <div className="w-full h-16 bg-gray-100 flex items-center justify-between px-4">
        {/* Previous Button */}
        {currentQuestion > 0 && (
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={handlePreviousQuestion}
          >
            Previous
          </button>
        )}

        {/* Submit Button */}
        <button
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={handleSubmitQuiz}
        >
          Submit
        </button>

        {/* Next Button */}
        {currentQuestion < totalQuestions - 1 && (
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={handleNextQuestion}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default QuestionPanel;
