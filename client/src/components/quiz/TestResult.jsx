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
    <div className="min-h-screen flex flex-col items-center justify-center font-poppins">
      <div className="w-[90%]  h-[10%] bg-white"></div>

      <div className="flex flex-col justify-center items-center w-full px-4 md:w-[80%] lg:w-[60%] xl:w-[50%]">
        <h1 className="md:text-3xl text-xl font-bold text-green-600 mt-[10%]">
          Thank you for taking the test
        </h1>
        <h1 className="md:text-3xl text-xl  font-bold mb-4 md:mt-4 mt-[10%] text-green-600">
          Your Report
        </h1>
        <div className="flex flex-col md:flex-row justify-around w-full mt-8">
          <div className="md:w-[45%] m-10 md:m-1 rounded-xl bg-white p-4 mb-8 md:mb-0 relative">
            <h2 className="text-xl font-bold mb-4 text-center">
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
            <div className="flex flex-col mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p>Questions Attended: {wrongCount + correctCount}</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-[#DC6C2D] w-3 h-3 ml-2 justify-end"></div>
                </div>
              </div>
              <hr className="w-full my-4 border-t-2 border-gray-400" />
              <div className="flex items-center justify-between">
                <p>Total Questions: {totalQuestions}</p>
                <div className="bg-[#777777] w-3 h-3 ml-2"></div>
              </div>
            </div>
          </div>
          <div className="md:w-[45%] m-10 md:m-1 rounded-xl bg-white p-4 relative">
            <h2 className="text-xl font-bold text-center mb-4">
              Correct Answers
            </h2>
            <div className="flex justify-center">
              {getDoughnutChart(
                correctCount,
                totalQuestions,
                "#1B9D34",
                "#1B9D34"
              )}
            </div>
            <div className="flex flex-col mt-4">
              <div className="flex items-center justify-between">
                <p>Correctly Answered: {correctCount}</p>
                <div className="bg-[#1B9D34] w-3 h-3 ml-2"></div>
              </div>
              <hr className="w-full my-4 border-t-2 border-gray-400" />
              <div className="flex items-center justify-between">
                <p>Total Questions: {totalQuestions}</p>
                <div className="bg-[#777777] w-3 h-3 ml-2"></div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="mt-8 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>

      <div className="w-[90%] h-[10%] bg-white"></div>
    </div>
  );
};

export default TestResult;
