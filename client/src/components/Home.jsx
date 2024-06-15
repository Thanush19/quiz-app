import React, { useState } from "react";
import Sidebar from "./common/Sidebar";
import Topbar from "./common/Topbar";
import AttendQuiz from "./quiz/AttendQuiz";
import { BsListNested } from "react-icons/bs";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`md:w-[20%] md:block fixed inset-y-0 left-0 z-50 bg-white overflow-y-auto overflow-x-hidden ${
          sidebarOpen ? "block" : "hidden"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Hamburger menu for screens less than md */}
      <div className={`md:hidden ${sidebarOpen ? "hidden" : "block"}`}>
        <button onClick={toggleSidebar} className="p-4">
          <BsListNested size={24} />
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-grow ml-[20%] md:ml-0">
        <Topbar />
        <AttendQuiz />
      </div>
    </div>
  );
};

export default Home;
