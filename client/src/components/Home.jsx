import React, { useState } from "react";
import Sidebar from "./common/Sidebar";
import Topbar from "./common/Topbar";
import AttendQuiz from "./quiz/AttendQuiz";
import { BsListNested } from "react-icons/bs";
import Sidebar1 from "./common/Sidebar1";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen font-sathoshi ">
      {/* <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      <Sidebar1 />

      {/* <div className={`md:hidden ${sidebarOpen ? "hidden" : "block"}`}>
        <button onClick={toggleSidebar} className="p-4">
          <BsListNested size={24} />
        </button>
      </div> */}

      <div className="flex flex-col flex-grow    md:ml-0">
        <Topbar />
        <AttendQuiz />
      </div>
    </div>
  );
};

export default Home;
