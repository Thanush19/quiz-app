import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    totalQuestions,
    correctCount,
    wrongCount,
    unattemptedCount,
    testName,
    totalTimeTaken,
    averageTimePerQuestion,
    timeTakenForEachQuestion,
  } = location.state;

  // Data for the first donut chart (Wrong Answers and Total Questions)
  const firstChartData = {
    labels: ["Wrong Answers", "Total Questions"],
    datasets: [
      {
        label: "Questions",
        data: [wrongCount, totalQuestions - wrongCount],
        backgroundColor: ["#FF0000", "#E0E7FF"],
        hoverBackgroundColor: ["#FF0000", "#E0E7FF"],
        borderWidth: 1,
      },
    ],
  };

  const secondChartData = {
    labels: ["Correct Answers", "Total Questions"],
    datasets: [
      {
        label: "Answers",
        data: [correctCount, totalQuestions - correctCount],
        backgroundColor: ["#00FF00", "#E0E7FF"],
        hoverBackgroundColor: ["#00FF00", "#E0E7FF"],
        borderWidth: 1,
      },
    ],
  };

  // Options for reducing the thickness of the donuts and adding percentage labels
  const options = {
    cutout: "80%", // This makes the donut chart thinner
    plugins: {
      datalabels: {
        display: false, // Disable datalabels
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce(
              (acc, val) => acc + val,
              0
            );
            const percentage = ((context.parsed / total) * 100).toFixed(2);
            return `${percentage}%`;
          },
        },
      },
    },
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="bg-white h-[8%]  w-[90%] mt-3 mb-2 rounded-lg"></div>

        {/* <h1 className="text-3xl font-bold mb-4">Quiz Results: {testName}</h1> */}
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Thank you for taking the test
        </h1>
        <div className="flex flex-col w-[50%]  md:flex-row justify-around mt-10">
          <div className="md:w-1/3 h-full rounded-xl bg-white p-4 mt-5">
            <h2 className="text-xl font-bold mb-4">Questions Overview</h2>
            <div className="">
              <Doughnut data={firstChartData} options={options} />
            </div>
            <div className="text-center mt-4">
              <div className="flex flex-row justify-center items-center">
                <div className="bg-red-600 w-3 h-3"></div>
                <p>Wrongly Answered: {wrongCount}</p>
              </div>
              <hr className="w-full my-4 border-t-2 border-gray-400" />

              <div className="flex flex-row justify-center items-center">
                <div className="bg-gray-400 w-3 h-3"></div>

                <p>Total Questions: {totalQuestions}</p>
              </div>
            </div>
          </div>
          <div className="w-full rounded-xl md:w-1/3 h-full bg-white mt-5 p-4">
            <h2 className="text-xl font-bold mb-4">Answers Overview</h2>
            <div className="">
              <Doughnut data={secondChartData} options={options} />
            </div>
            <div className="text-center mt-4">
              <div className="flex flex-row justify-center items-center">
                <div className="bg-green-400 w-3 h-3"></div>
                <p>Correctly Answered: {correctCount}</p>
              </div>
              <hr className="w-full my-4 border-t-2 border-gray-400" />

              <div className="flex flex-row justify-center items-center">
                <div className="bg-gray-400 w-3 h-3"></div>

                <p>Total Questions: {totalQuestions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* <h2 className="mt-10 text-2xl font-bold">
          Time Taken for Each Question:
        </h2> */}
        <p className="mt-7 font-semibold  ">
          Average Time Per Question:
          <span className="font-bold"> {averageTimePerQuestion} seconds</span>
        </p>

        <button
          className="mt-8 bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
        <div className="bg-white h-[8%] mt-10 w-[90%] mb-6 rounded-lg"></div>
      </div>
    </>
  );
};

export default TestResult;
