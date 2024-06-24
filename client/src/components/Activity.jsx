import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { backend } from "../../constant";
import { BsArrowLeft } from "react-icons/bs";

const Activity = () => {
  const { user, logout } = useContext(UserContext);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState([]);
  const nav = useNavigate();

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
      const quizMap = {};

      quizAttempts.forEach((attempt) => {
        const { quiz_name, correctly_answered, total_questions } = attempt;
        const marks = correctly_answered * 10;

        if (!quizMap[quiz_name]) {
          quizMap[quiz_name] = {
            quiz_name,
            marks,
            total_questions,
            attempts: 1,
          };
        } else {
          quizMap[quiz_name].attempts += 1;
          if (marks > quizMap[quiz_name].marks) {
            quizMap[quiz_name].marks = marks;
          }
        }
      });

      setQuizData(Object.values(quizMap));
    }
  }, [quizAttempts]);

  const goBack = () => {
    nav("/");
  };

  return (
    <div className="flex font-satoshi   -ml-10 ">
      {/* <Sidebar1 /> */}
      <div className="flex-grow md:w-[60%]">
        <div className="flex justify-between items-center">
          {/* <button
            onClick={goBack}
            className="text-white bg-violet-400 md:mr-10 hover:bg-violet-700 md:p-4 p-2 rounded ml-4"
          >
            <BsArrowLeft className="h-5 w-5" />
          </button> */}

          <h1 className="text-center text-2xl mx-auto mt-20 text-ind font-bold mb-4">
            Activity Overview
          </h1>
          {/* <button
            onClick={logout}
            className="text-white bg-red-500 md:mr-10 hover:bg-red-700 md:p-4 p-1 md:text-xl text-md rounded ml-4"
          >
            Logout
          </button> */}
        </div>
        <div className="flex flex-col items-center rounded-3xl ">
          {loading ? (
            <p>Loading quiz data...</p>
          ) : (
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-300">
                    Quiz Name
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300">
                    Best Marks
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300">
                    Total Questions
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300">
                    Attempts
                  </th>
                </tr>
              </thead>
              <tbody>
                {quizData.map((quiz, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                      {quiz.quiz_name}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                      {quiz.marks}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                      {quiz.total_questions}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                      {quiz.attempts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
