import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import { UserContext } from "../context/userContext";
import { backend } from "../../constant";
import ThreeDimScatterChart from "./ThreeDimScatterChart";
import Sidebar from "./common/Sidebar";

ChartJS.register(ArcElement, Legend);

const Profile = () => {
  const { user } = useContext(UserContext);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [correctData, setCorrectData] = useState({});
  const [wrongData, setWrongData] = useState({});
  const [averageTimeData, setAverageTimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        const response = await axios.get(
          `${backend}/api/quiz-attempts/${user.id}`
        );
        setQuizAttempts(response.data);
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

  useEffect(() => {
    if (quizAttempts.length > 0) {
      const correctAnswers = quizAttempts.reduce(
        (acc, cur) => acc + cur.correctly_answered,
        0
      );
      const wrongAnswers = quizAttempts.reduce(
        (acc, cur) => acc + cur.wrong_answered,
        0
      );
      const totalQuestionsAttempted = quizAttempts.reduce(
        (acc, cur) => acc + cur.total_questions,
        0
      );

      const correctPercentage = (
        (correctAnswers / totalQuestionsAttempted) *
        100
      ).toFixed(2);
      const wrongPercentage = (
        (wrongAnswers / totalQuestionsAttempted) *
        100
      ).toFixed(2);

      setCorrectData({
        labels: ["Correct Percentage", "Total Questions"],
        datasets: [
          {
            label: "Correct Percentage",
            data: [correctPercentage, 100 - correctPercentage],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(211, 211, 211, 0.6)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(211, 211, 211, 1)"],
            borderWidth: 1,
          },
        ],
      });

      const wrongPercentageValue = parseFloat(wrongPercentage);
      const remainingPercentage = 100 - wrongPercentageValue;

      setWrongData({
        labels: ["Wrong Percentage"],
        datasets: [
          {
            label: "Wrong Percentage",
            data: [wrongPercentageValue, remainingPercentage],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(211, 211, 211, 0.6)",
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(211, 211, 211, 1)"],
            borderWidth: 1,
          },
        ],
      });

      const averageTimeChartData = quizAttempts.map((attempt, index) => ({
        x: index + 1,
        y: parseFloat(attempt.average_time_taken),
        z: parseFloat(attempt.correctly_answered),
      }));

      setAverageTimeData(averageTimeChartData);
    }
  }, [quizAttempts]);

  return (
    <>
      <div className="flex">
        <Sidebar />

        <div className="flex-grow">
          <h1 className="text-center text-2xl text-violet-400 font-bold mb-4">
            Profile Overview
          </h1>
          {loading ? (
            <p>Loading quiz data...</p>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex flex-col md:flex-row justify-around items-center w-full">
                {correctData.datasets && (
                  <div className="bg-white p-4 m-2 shadow-md w-[90%] md:w-80">
                    <h2 className="text-center text-xl font-semibold text-violet-400  mb-2">
                      Correct Answers (%)
                    </h2>
                    <Doughnut
                      data={correctData}
                      options={{
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function (tooltipItem, data) {
                                return `${data.labels[tooltipItem.index]}: ${
                                  data.datasets[0].data[tooltipItem.index]
                                }%`;
                              },
                            },
                          },
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                )}
                {wrongData.datasets && (
                  <div className="bg-white p-4 m-2 shadow-md w-[90%] md:w-80">
                    <h2 className="text-center text-violet-400  text-xl font-semibold mb-2">
                      Wrong Answers (%)
                    </h2>
                    <Doughnut
                      data={wrongData}
                      options={{
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function (tooltipItem, data) {
                                return `${data.labels[tooltipItem.index]}: ${
                                  data.datasets[0].data[tooltipItem.index]
                                }%`;
                              },
                            },
                          },
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
              {averageTimeData.length > 0 && (
                <div className="flex justify-center w-full">
                  <div className="bg-white p-4 m-2 shadow-md w-[90%] md:w-80">
                    <h2 className="text-center text-violet-400  text-xl font-semibold mb-2">
                      Average Time Taken (in sec)
                    </h2>
                    <ThreeDimScatterChart data={averageTimeData} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
