import React from "react";
import logo from "../../assets/logo.jpg"; // Import your image file

const Sidebar = () => {
  return (
    <div className="h-screen w-[20%] bg-white rounded-r-xl flex flex-col justify-between">
      <div className="p-4">
        <img
          src={logo}
          className=" md:w-[50%] md:h-[50%] mx-auto rounded-t-xl"
        />
      </div>
      <div className="flex-grow flex flex-col justify-center items-center">
        Sidebar Content
      </div>
      <div className="p-4 flex justify-end">
        <p className="text-xs text-gray-500">Bottom Right</p>
      </div>
    </div>
  );
};

export default Sidebar;
