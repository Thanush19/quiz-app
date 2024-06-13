import React from "react";
import Sidebar from "./common/Sidebar";
import Topbar from "./common/Topbar";

const Home = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Topbar />
    </div>
  );
};

export default Home;
