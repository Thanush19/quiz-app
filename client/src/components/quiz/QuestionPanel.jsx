import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import "./question.css";

import {
  BsListCheck,
  BsArrowLeft,
  BsArrowRight,
  BsClock,
  BsBookmark,
} from "react-icons/bs"; // Importing icons
import Questions from "./Questions";
import axios from "axios";
import { backend } from "../../../constant";
import { UserContext } from "../../context/userContext";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material"; // Import MUI components

const QuestionPanel = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { quizId } = useParams();
  const quiz = Questions[quizId];
  const totalQuestions = quiz.questions.length;
  const [openModal, setOpenModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu anchor
  const [currentQuestion, setCurrentQuestion] = useState(0); // State for current question index
  const [answers, setAnswers] = useState(new Array(totalQuestions).fill("")); // State for storing answers
  const [answeredStatus, setAnsweredStatus] = useState(
    new Array(totalQuestions).fill(false)
  ); // State to track if question is answered
  const [markedForReview, setMarkedForReview] = useState(
    new Array(totalQuestions).fill(false)
  ); // State to track questions marked for review
  const [startTime, setStartTime] = useState(new Date()); // State to store quiz start time
  const [elapsedTime, setElapsedTime] = useState(0); // State to store elapsed time in seconds

  const dropdownRef = useRef(null); // Ref for dropdown menu

  // Effect to listen for clicks outside the dropdown and close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAnchorEl(null); // Close dropdown if clicked outside
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmEndTest = () => {
    setOpenModal(false);
    navigate("/");
  };

  const handleSubmitQuiz = () => {
    setOpenSubmitModal(true);
  };

  const handleCloseSubmitModal = () => {
    setOpenSubmitModal(false);
  };

  const handleConfirmSubmitQuiz = async () => {
    setOpenSubmitModal(false);

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

  const toggleMarkedForReview = (index) => {
    const newMarkedForReview = [...markedForReview];
    newMarkedForReview[index] = !newMarkedForReview[index];
    setMarkedForReview(newMarkedForReview);
  };

  return (
    <div className="flex flex-col h-screen relative font-sathoshi ">
      {/* header */}
      <div className="h-[14%] md:h-[5rem] md:p-0.1 p-3 m-4 md:rounded-3xl rounded-2xl bg-white flex items-center justify-between  relative">
        {/* Previous Button */}
        {/* {currentQuestion > 0 && (
         
        )} */}
        <button
          className="text-black bg-gray-100  hover:text-gray-800 md:mr-4  md:p-3 p-1 ml-[10%] mr-4 rounded-xl focus:outline-none"
          onClick={handleEndTest}
        >
          <BsArrowLeft className="md:h-5 md:w-5 sm:h-4 sm:w-4 h-5 w-5 " />
        </button>
        {/* Menu Icon */}

        <button
          className="text-gray bg-gray-100 md:p-3 p-1.5  rounded-xl  hover:text-gray-800 focus:outline-none relative"
          onClick={handleMenuClick}
        >
          <BiMenu className="md:h-5 md:w-5 sm:h-4 sm:w-4 h-5 w-5 " />
        </button>

        {/* Timer */}
        <div className="flex md:flex-grow sm:w-[2rem]  ml-6  md:ml-1 items-center justify-center">
          <BsClock className="md:h-5 md:w-5 h-4 w-4 lg:h-7 lg:w-7 mr-2 text-gray-600 md:mr-2" />
          <span className="text-gray-600 sm:mr-5 md:text-lg">
            {formatTime(elapsedTime)}
          </span>
        </div>

        {/* End Test Button */}
        <button
          className="ml-2 md:ml-auto sm:text-sm  text-black font-medium bg-gray-100 md:p-3 sm:p-3 p-2 text-[10px]  mr-[3%] rounded-xl hover:text-gray-800 focus:outline-none relative"
          onClick={handleSubmitQuiz}
        >
          End Round
        </button>
      </div>

      {/* Body */}
      <div className="flex-1  font-medium ">
        <div className="h-full flex items-center md:flex-row flex-col ">
          {/* Questions Section */}

          <div className="md:w-[40%] md:h-[100%]  w-[80%] md:ml-4 h-[30%] mb-2 rounded-xl bg-white overflow-y-auto text-sm sm:test-md   custom-scrollbar">
            {/* dropdown           */}
            {anchorEl && (
              <div
                ref={dropdownRef}
                className="absolute bg-white shadow-lg rounded-lg border xl:w-[15%]  lg:w-[20%] md:w-[30%] w-[60%] border-gray-200 h-[80%] lg:h-[110%] xl:h-[70%] md:h-[10%] overflow-y-auto"
              >
                {quiz.questions.map((question, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 md:w-[10rem] ${
                      markedForReview[index] ? "bg-yellow-100" : ""
                    }`}
                  >
                    <label
                      htmlFor={`question_${index}`}
                      className={"ml-1 cursor-pointer "}
                    >
                      <div className="flex flex-row ml-[5%]">
                        <span className="font-bold rounded-full border-2 border-black md:w-6 md:h-6 w-4 h-4 p-4  flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="flex flex-col  flex-nowrap ml-[35%]">
                          <span className="font-medium ">Mcq</span>
                          <span className="font-light text-xs whitespace-nowrap text-gray-300">
                            5 Points
                          </span>
                        </div>
                      </div>
                    </label>
                    <div className="flex absolute justify-end right-4">
                      <input
                        type="checkbox"
                        id={`question_${index}`}
                        checked={answeredStatus[index]}
                        className="appearance-none w-1 h-1 m-3 p-3 rounded-full border ml-8 border-gray-300 checked:bg-green-500 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
                        readOnly
                      />
                      <button
                        className=""
                        onClick={() => toggleMarkedForReview(index)}
                      >
                        <BsBookmark
                          className={`h-6 w-6 ${
                            markedForReview[index]
                              ? "text-yellow-600"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="md:p-10 p-5 ">
              <h2 className="md:mb-10 mb-4">
                Question No: {currentQuestion + 1}
              </h2>
              <h2 className="">{quiz.questions[currentQuestion].question}</h2>
              {/* Mark for Review Button */}
              <div className="flex items-center md:mt-4 mt-2">
                <button
                  className={`text-sm  py-1 px-3 rounded-lg ${
                    markedForReview[currentQuestion]
                      ? "bg-yellow-200 text-yellow-600"
                      : "bg-gray-200 text-gray-600"
                  } hover:bg-yellow-200 hover:text-yellow-600 focus:outline-none`}
                  onClick={() => toggleMarkedForReview(currentQuestion)}
                >
                  {markedForReview[currentQuestion]
                    ? "Marked for Review"
                    : "Mark for Review"}
                </button>
              </div>
            </div>
          </div>

          {/* Answer Section */}
          <div className="md:w-[57.5%]   overflow-y-auto md:ml-4  text-sm sm:test-md   md:h-[100%]  w-[80%] h-[60%] mb-2 rounded-xl bg-white md:p-10 sm:p-5 p-3 ">
            <ul className="">
              <h2 className=" md:ml-4   mb-5 md:mb-[0.1px]  ">
                Select the Correct answer
              </h2>

              {quiz.questions[currentQuestion].options.map((option, oIndex) => (
                <li
                  key={oIndex}
                  className="mb-2 border text-[13px] sm:test-md   md:max-w-[40%] border-gray-300 rounded-3xl p-3 md:mt-6 flex"
                >
                  <label className="">
                    <input
                      type="radio"
                      name={`question_${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === option}
                      className={`appearance-none md:h-4 md:w-4 h-3 w-3  md:ml-6  border-[1px] rounded-full ${
                        answers[currentQuestion] === option
                          ? "border-black bg-black"
                          : "border-black"
                      }`}
                      onChange={handleOptionChange}
                    />
                    <span className="md:ml-6 ml-3">{option} ;</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="h-[15%] md:h-[10%] md:p-0.1 p-3 m-4 md:rounded-3xl rounded-2xl bg-white flex items-center justify-between  relative"></div> */}
      <div className="h-[14%] md:h-[5rem] md:p-0.1 md:mt-6 m-4 p-3 -mt-5  md:mb-6 rounded-2xl bg-white flex items-center justify-between relative">
        {/* Previous Button */}
        <div className="flex-grow flex md:justify-center  rounded-3xl ">
          <button
            className={`flex items-center  font-semibold border-2 border-gray-200 bg-gray-100 p-2 rounded-2xl text-black md:p-3 md:rounded-lg hover:text-gray-800 focus:outline-none ${
              currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePreviousQuestion}
          >
            <BsArrowLeft className="h-5 w-5 mr-1 text-black" />
            <span>Previous</span>
          </button>
        </div>

        {/* Next Button */}
        <div className="flex md:mr-[5%] ">
          {currentQuestion < totalQuestions - 1 && (
            <button
              className={`flex items-center  font-semibold border-2 border-gray-200 bg-gray-100 p-2 rounded-2xl  md:p-3 md:rounded-lg hover:text-gray-800 focus:outline-none ${
                currentQuestion === totalQuestions - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleNextQuestion}
            >
              <span>Save & Next</span>
              <BsArrowRight className="h-5 w-5 ml-1" />
            </button>
          )}
          {currentQuestion === totalQuestions - 1 && (
            <button
              className={`flex items-center  font-semibold border-2 border-gray-200 bg-gray-100 p-2 rounded-2xl  md:p-3 md:rounded-lg hover:text-gray-800 focus:outline-none 
              }`}
              onClick={handleSubmitQuiz}
            >
              <span>Submit</span>
              <BsArrowRight className="h-5 w-5 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>End Test</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you end the test now, your score will not be considered. Are you
            sure you want to leave?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmEndTest} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submit Confirmation Modal */}
      <Dialog open={openSubmitModal} onClose={handleCloseSubmitModal}>
        <DialogTitle>Submit Quiz</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the quiz? Once submitted, your
            answers will be final.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmitModal} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmSubmitQuiz} color="primary" autoFocus>
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>
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
