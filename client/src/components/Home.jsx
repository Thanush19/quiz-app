import React from "react";
import Sidebar from "./common/Sidebar";
import Topbar from "./common/Topbar";
import AttendQuiz from "./quiz/AttendQuiz";

const Home = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Topbar />
        <AttendQuiz />
      </div>
    </div>
  );
};

export default Home;
