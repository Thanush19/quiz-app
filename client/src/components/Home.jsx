import React, { useState } from "react";
import Sidebar from "./common/Sidebar";
import Topbar from "./common/Topbar";
import AttendQuiz from "./quiz/AttendQuiz";
import { BsListNested } from "react-icons/bs";
import Sidebar1 from "./common/Sidebar1";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen font-satoshi ">
      {/* <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      <Sidebar1 />

      <div className="flex flex-col flex-grow    md:ml-0">
        <Topbar />
        <AttendQuiz />
      </div>
    </div>
  );
};

export default Home;
