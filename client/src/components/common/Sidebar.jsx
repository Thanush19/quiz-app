import React, { useContext } from "react";
import logo from "../../assets/logo.jpg";
import { BsListNested } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const Sidebar = () => {
  const nav = useNavigate();
  const { user } = useContext(UserContext);
  const goToProfile = () => {
    if (user) {
      nav(`/profile/${user.id}`);
    }
  };
  const goToTest = () => {
    if (user) {
      nav("/");
    }
  };

  return (
    <div className="h-screen w-[20%] bg-white rounded-r-xl flex flex-col justify-between">
      <div className="p-4">
        <img
          src={logo}
          alt="Logo"
          className="md:w-[50%] md:h-[50%] mx-auto rounded-t-xl"
        />
      </div>
      <div className="flex-grow flex flex-col justify-center items-center">
        <button onClick={goToProfile}>Profile</button>
      </div>
      <div className="flex-grow flex flex-col justify-center items-center">
        <button onClick={goToTest}>Test</button>
      </div>
    </div>
  );
};

export default Sidebar;
