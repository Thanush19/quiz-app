import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { UserContext } from "../context/userContext";
import { BsArrowLeft } from "react-icons/bs";
import { backend } from "../../constant";
import * as echarts from "echarts";

import Sidebar from "./common/Sidebar";
import { useNavigate } from "react-router-dom";
import Sidebar1 from "./common/Sidebar1";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Profile = () => {
  const { user, logout } = useContext(UserContext);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [averageTimeData, setAverageTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

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
      const unAttempted = (100 - correctPercentage - wrongPercentage).toFixed(
        2
      );

      setChartData({
        labels: ["Correct %", "Wrong %", "Un-Attempted %"],
        datasets: [
          {
            label: "Quiz Data",
            data: [correctPercentage, wrongPercentage, unAttempted],
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
        timeTaken: parseFloat(attempt.average_time_taken),
        correctlyAnswered: parseFloat(attempt.correctly_answered),
      }));

      setAverageTimeData(averageTimeChartData);
    }
  }, [quizAttempts]);

  useEffect(() => {
    if (averageTimeData.length > 0 && chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option = {
        title: {
          // text: "Average Time Taken and Correct Answers",
          left: "center",
          textStyle: {
            color: "#333",
            fontWeight: "bold",
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Time Taken (sec)", "Correct Answers"],
          bottom: 10,
        },
        xAxis: {
          type: "category",
          data: averageTimeData.map((data) => data.name),
        },
        yAxis: [
          {
            type: "value",
            name: "Time Taken (sec)",
            position: "left",
            axisLine: {
              lineStyle: {
                color: "#8884d8",
              },
            },
          },
          {
            type: "value",
            name: "Correct Answers",
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#82ca9d",
              },
            },
          },
        ],
        series: [
          {
            name: "Time Taken (sec)",
            type: "line",
            data: averageTimeData.map((data) => data.timeTaken),
            smooth: true,
            animationDuration: 1000,
            itemStyle: {
              color: "#8884d8",
            },
          },
          {
            name: "Correct Answers",
            type: "line",
            yAxisIndex: 1,
            data: averageTimeData.map((data) => data.correctlyAnswered),
            smooth: true,
            animationDuration: 1000,
            itemStyle: {
              color: "#82ca9d",
            },
          },
        ],
      };

      chartInstance.setOption(option);

      return () => {
        chartInstance.dispose();
      };
    }
  }, [averageTimeData]);

  const nav = useNavigate();
  const goBack = () => {
    nav("/");
  };

  return (
    <>
      <div className="flex">
        <Sidebar1 />

        <div className="flex-grow md:w-[60%] ">
          <div className="flex justify-between items-center ">
            <button
              onClick={goBack}
              className="text-white bg-violet-400 md:mr-10 hover:bg-violet-700 md:p-4 p-2 rounded ml-4"
            >
              <BsArrowLeft className="h-5 w-5 " />
            </button>

            <h1 className="text-center text-2xl mx-auto mt-20 text-violet-400 font-bold mb-4">
              Profile Overview
            </h1>
            <button
              onClick={logout}
              className="text-white bg-red-500 md:mr-10 hover:bg-red-700 md:p-4 p-1 md:text-xl text-md rounded ml-4"
            >
              Logout
            </button>
          </div>
          <div className="flex md:flex-row flex-col">
            {loading ? (
              <p>Loading quiz data...</p>
            ) : (
              <div className="flex md:flex-row justify-between  flex-col md:ml-[10%]  items-center">
                {averageTimeData.length > 0 && (
                  <div className="bg-white p-4 m-2 shadow-md sm:w-[140%]  ">
                    <h2 className="text-center text-violet-400 text-xl font-semibold mb-2">
                      Average Time Taken (in sec)
                    </h2>
                    <div ref={chartRef} style={{ width: 300, height: 300 }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
