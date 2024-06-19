import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { UserContext } from "../context/userContext";

import { backend } from "../../constant";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "./common/Sidebar";
import { useNavigate } from "react-router-dom";
import Sidebar1 from "./common/Sidebar1";

ChartJS.register(ArcElement, Legend, Tooltip);

const Profile = () => {
  const { user, logout } = useContext(UserContext);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [chartData, setChartData] = useState(null);
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
      const remainingPercentage = (
        100 -
        correctPercentage -
        wrongPercentage
      ).toFixed(2);

      setChartData({
        labels: ["Correct %", "Wrong %", "questions attempted %"],
        datasets: [
          {
            label: "Quiz Data",
            data: [correctPercentage, wrongPercentage, remainingPercentage],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(211, 211, 211, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(211, 211, 211, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });

      const averageTimeChartData = quizAttempts.map((attempt, index) => ({
        name: `Attempt ${index + 1}`,
        uv: parseFloat(attempt.average_time_taken),
        pv: parseFloat(attempt.correctly_answered),
      }));

      setAverageTimeData(averageTimeChartData);
    }
  }, [quizAttempts]);
  const nav = useNavigate();
  const goBack = () => {
    nav("/");
  };

  return (
    <>
      <div className="flex">
        {/* <Sidebar /> */}
        <Sidebar1 />

        <div className="flex-grow md:w-[60%] ">
          <div className="flex justify-between items-center">
            <button
              onClick={goBack}
              className="text-white bg-violet-400 md:mr-10 hover:bg-violet-700 px-4 py-2 rounded ml-4"
            >
              Go back
            </button>

            <h1 className="text-center text-2xl mx-auto mt-20 text-violet-400 font-bold mb-4">
              Profile Overview
            </h1>
            <button
              onClick={logout}
              className="text-white bg-red-500 md:mr-10 hover:bg-red-700 px-4 py-2 rounded ml-4"
            >
              Logout
            </button>
          </div>
          {loading ? (
            <p>Loading quiz data...</p>
          ) : (
            <div className="flex flex-col md:ml-[10%] md:flex-row items-center">
              <div className="bg-white p-4 m-2 shadow-md w-[90%] md:w-80">
                <h2 className="text-center text-xl font-semibold  text-violet-400 mb-2">
                  Quiz Performance
                </h2>
                {chartData && (
                  <ResponsiveContainer width="100%" height={400}>
                    <Doughnut
                      data={chartData}
                      options={{
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function (tooltipItem, data) {
                                return `${
                                  data.labels[tooltipItem.dataIndex]
                                }: ${
                                  data.datasets[0].data[tooltipItem.dataIndex]
                                }%`;
                              },
                            },
                          },
                          legend: {
                            display: true,
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </ResponsiveContainer>
                )}
              </div>
              {averageTimeData.length > 0 && (
                <div className="flex justify-center w-full">
                  <div className="bg-white p-4 m-2 shadow-md w-[90%] md:w-80">
                    <h2 className="text-center text-violet-400 text-xl font-semibold mb-2">
                      Average Time Taken (in sec)
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        width={500}
                        height={400}
                        data={averageTimeData}
                        syncId="anyId"
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="uv"
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                        <Line
                          type="monotone"
                          dataKey="pv"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                        />
                      </LineChart>
                    </ResponsiveContainer>
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
