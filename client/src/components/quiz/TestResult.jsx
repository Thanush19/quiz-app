import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    totalQuestions,
    correctCount,
    wrongCount,
    testName,
    averageTimePerQuestion,
  } = location.state;

  const handleBackToHome = () => {
    navigate("/");
  };

  const getDoughnutChart = (attended, total, color, percentageColor) => {
    const percentage = (attended / total) * 100;
    const remainingPercentage = 100 - percentage;

    return (
      <svg width="200" height="200" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.91549431"
          fill="transparent"
          stroke="#E0E7FF"
          strokeWidth="4"
        />
        <circle
          cx="18"
          cy="18"
          r="15.91549431"
          fill="transparent"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${percentage} ${remainingPercentage}`}
          strokeDashoffset="75"
          strokeLinecap="round"
        />
        <text
          x="18"
          y="20.35"
          textAnchor="middle"
          fontSize="8px"
          fill={percentageColor}
          fontWeight="bold"
        >
          {attended}
        </text>
      </svg>
    );
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center font-poppins">
      <div className="bg-white h-[8%] w-[90%] top-0 absolute mt-3 mb-2 rounded-lg"></div>

      <div className=" absolute top-[15%] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold  text-green-600">
          Thank you for taking the test
        </h1>
        <h1 className="text-3xl font-bold mb-4 md:mt-[1rem] text-green-600">
          Your Report
        </h1>
        <div className="flex flex-col   md:w-[150%] md:flex-row justify-around mt-10">
          <div className="md:w-1/3 rounded-xl bg-white p-4 mt-5">
            <h2 className="text-xl font-bold mb-4 text-nowrap">
              Questions Attended
            </h2>
            <div className="flex justify-center">
              {getDoughnutChart(
                wrongCount + correctCount,
                totalQuestions,
                "#DC6C2D",
                "#DC6C2D"
              )}
            </div>
            <div className="flex flex-col justify-start mt-4">
              <div className="flex flex-row justify-start items-center">
                <div className="bg-[#DC6C2D] w-3 h-3 mr-2"></div>
                <p>Questions Attended: {wrongCount + correctCount}</p>
              </div>
              <hr className="w-full my-4 border-t-2 border-gray-400" />
              <div className="flex flex-row justify-stat items-center">
                <div className="bg-[#777777] w-3 h-3 mr-2"></div>
                <div className="justify-end">
                  <p>Total Questions: {totalQuestions}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full rounded-xl md:w-1/3  bg-white mt-5 p-4">
            <h2 className="text-xl font-bold mb-4">Correct Answers</h2>
            <div className="flex justify-center">
              {getDoughnutChart(
                correctCount,
                totalQuestions,
                "#1B9D34",

                "#1B9D34"
              )}
            </div>
            <div className="text-center mt-4">
              <div className="flex flex-row justify-start items-center">
                <div className="bg-[#1B9D34] w-3 mr-2 h-3"></div>
                <p>Correctly Answered: {correctCount}</p>
              </div>
              <hr className="w-full my-4 border-t-2 border-gray-400" />
              <div className="flex flex-row justify-start items-center">
                <div className="bg-[#777777] w-3 mr-2 h-3"></div>
                <div className="justify-end">
                  <p>Total Questions: {totalQuestions}</p>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
        {/* <p className="mt-7 font-semibold">
          Average Time Per Question:
          <span className="font-bold"> {averageTimePerQuestion} seconds</span>
        </p> */}
        <button
          className="m-3 bg-ind hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>

      <div className="bg-white h-[8%] absolute bottom-0  w-[90%] mb-6 rounded-lg"></div>
    </div>
  );
};

export default TestResult;
