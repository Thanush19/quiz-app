import React, { useContext } from "react";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { BsX } from "react-icons/bs";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const nav = useNavigate();
  const { user } = useContext(UserContext);

  const goToProfile = () => {
    if (user) {
      nav(`/profile/${user.id}`);
      toggleSidebar();
    }
  };

  const goToTest = () => {
    if (user) {
      nav("/");
      toggleSidebar();
    }
  };

  return (
    <div
      className={`h-screen w-full md:w-[20%] bg-white rounded-r-xl ${
        isOpen ? "block" : "hidden"
      } md:block`}
    >
      <div className="md:hidden absolute top-0 left-0 m-4">
        <button onClick={toggleSidebar}>
          <BsX size={24} />
        </button>
      </div>

      <div className="p-4">
        <img
          src={logo}
          alt="Logo"
          className="w-[50%] h-[50%] mx-auto rounded-t-xl"
        />
        <div className="flex-grow flex flex-col justify-center items-center mt-4">
          <button onClick={goToProfile}>Profile</button>
          <button onClick={goToTest} className="mt-2">
            Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
