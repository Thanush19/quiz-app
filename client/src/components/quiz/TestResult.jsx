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
        backgroundColor: ["#FF0000", "#E0E7FF"], // red and blue-100
        hoverBackgroundColor: ["#FF0000", "#E0E7FF"],
        borderWidth: 1,
      },
    ],
  };

  // Data for the second donut chart (Correct Answers and Total Questions)
  const secondChartData = {
    labels: ["Correct Answers", "Total Questions"],
    datasets: [
      {
        label: "Answers",
        data: [correctCount, totalQuestions - correctCount],
        backgroundColor: ["#00FF00", "#E0E7FF"], // green and blue-100
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
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Quiz Results: {testName}</h1>
      <div className="flex flex-col w-[50%] md:flex-row justify-around mt-10">
        <div className="md:w-1/3 h-full bg-white p-4 mt-5">
          <h2 className="text-xl font-bold mb-4">Questions Overview</h2>
          <div className="">
            <Doughnut data={firstChartData} options={options} />
          </div>
          <div className="text-center mt-4">
            <p>Wrongly Answered: {wrongCount}</p>
            <p>Total Questions: {totalQuestions}</p>
          </div>
        </div>
        <div className="w-full md:w-1/3 h-full bg-white mt-5 p-4">
          <h2 className="text-xl font-bold mb-4">Answers Overview</h2>
          <div className="">
            <Doughnut data={secondChartData} options={options} />
          </div>
          <div className="text-center mt-4">
            <p>Correctly Answered: {correctCount}</p>
            <p>Total Questions: {totalQuestions}</p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-2xl font-bold">
        Time Taken for Each Question:
      </h2>
      <p>Average Time Per Question: {averageTimePerQuestion} seconds</p>

      <button
        className="mt-8 bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleBackToHome}
      >
        Back to Home
      </button>
    </div>
  );
};

export default TestResult;
