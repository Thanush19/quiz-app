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
      <div className="w-[90%] md:h-14 h-10 md:mt-10 mt-5 rounded-3xl bg-white"></div>

      <div className="flex flex-col justify-center items-center w-full px-4 md:w-[80%] lg:w-[60%] xl:w-[50%] min-h-[calc(100vh-8rem)]">
        <h1 className="md:text-3xl text-md font-bold text-green-600 mt-4">
          Thank you for taking the test
        </h1>
        <h1 className="md:text-3xl text-md font-bold mb-4 md:mt-4 mt-4 text-green-600">
          Your Report
        </h1>
        <div className="flex flex-col md:flex-row justify-around w-full md:mt-8">
          <div className="md:w-[45%] m-7 md:m-1 rounded-xl bg-white p-4 mb-8 md:mb-0 relative">
            <h2 className="md:first-line:text-xl text-[1px] text-nowrap font-bold mb-4 text-center">
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
            <div className="flex flex-col mt-4  font-medium ">
              <div className="flex items-center font-medium justify-between">
                <div className="flex items-center">
                  <div className="bg-[#DC6C2D] w-3 h-3 ml-2 justify-end"></div>
                </div>
                <div className=" font-medium md:text-lg text-sm  ">
                  Questions Attended
                </div>
                <div className=" font-medium md:text-lg text-sm  ">
                  {wrongCount + correctCount}
                </div>
              </div>
              <hr className="w-full my-4 border-t-2 border-[#414142]" />
              <div className="flex items-center justify-between">
                <div className="bg-[#777777] w-3 h-3 ml-2"></div>
                <div className=" font-medium  md:text-lg text-sm  ">
                  {" "}
                  Total Questions
                </div>
                <div className=" font-medium md:text-lg text-sm ">
                  {totalQuestions}
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-[45%] m-7 md:m-1 rounded-xl bg-white p-4 relative">
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
                <div className="bg-[#1B9D34] w-3 h-3 ml-2"></div>
                <div className=" font-medium md:text-lg text-sm  ">
                  Correctly Answered
                </div>
                <div className=" font-medium md:text-lg text-sm  ">
                  {correctCount}
                </div>
              </div>
              <hr className="w-full my-4 border-t-2 border-[#414142]" />
              <div className="flex items-center justify-between">
                <div className="bg-[#777777] w-3 h-3 ml-2"></div>

                <div className=" font-medium md:text-lg text-sm ">
                  Total Questions
                </div>
                <div className=" font-medium md:text-lg text-sm  ">
                  {" "}
                  {totalQuestions}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="mt-5 bg-indigo-500 hover:bg-indigo-700 text-white font-bold md:p-4 p-2 rounded"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
      </div>

      <div className="w-[90%] md:h-14 h-10 mb-5 md:mb-10  mt-2 rounded-3xl bg-white"></div>
    </div>
  );
};

export default TestResult;
