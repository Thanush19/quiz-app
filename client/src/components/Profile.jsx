import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { UserContext } from "../context/userContext";
import { backend } from "../../constant";
import ThreeDimScatterChart from "./ThreeDimScatterChart";

ChartJS.register(ArcElement, Tooltip, Legend);

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
      const averageTimeTaken =
        quizAttempts.reduce(
          (acc, cur) => acc + parseFloat(cur.average_time_taken),
          0
        ) / quizAttempts.length;

      const correctPercentage = (
        (correctAnswers / totalQuestionsAttempted) *
        100
      ).toFixed(2);
      const wrongPercentage = (
        (wrongAnswers / totalQuestionsAttempted) *
        100
      ).toFixed(2);

      setCorrectData({
        labels: ["Correct Percentage", "Others"],
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

      setWrongData({
        labels: ["Wrong Percentage", "Others"],
        datasets: [
          {
            label: "Wrong Percentage",
            data: [wrongPercentage, 100 - wrongPercentage],
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
        z: parseFloat(attempt.correctly_answered), // Using correctly_answered as the z value for example
      }));

      setAverageTimeData(averageTimeChartData);
    }
  }, [quizAttempts]);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-4">Profile Overview</h1>
      {loading ? (
        <p>Loading quiz data...</p>
      ) : (
        <div className="flex flex-col md:flex-row justify-around items-center">
          {correctData.datasets && (
            <div className="bg-white p-4 m-2 shadow-md w-[50%] md:w-1/3">
              <h2 className="text-center text-xl font-semibold mb-2">
                Correct Answers Percentage
              </h2>
              <Doughnut data={correctData} />
            </div>
          )}
          {wrongData.datasets && (
            <div className="bg-white p-4 m-2 shadow-md w-[50%] md:w-1/3">
              <h2 className="text-center text-xl font-semibold mb-2">
                Wrong Answers Percentage
              </h2>
              <Doughnut data={wrongData} />
            </div>
          )}
          {averageTimeData.length > 0 && (
            <div className="bg-white p-4 m-2 shadow-md w-[50%] md:w-1/3">
              <h2 className="text-center text-xl font-semibold mb-2">
                Average Time Taken
              </h2>
              <ThreeDimScatterChart data={averageTimeData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
