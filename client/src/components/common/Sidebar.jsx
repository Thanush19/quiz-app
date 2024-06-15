import React, { useContext } from "react";
import logo from "../../assets/logo.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { BsX, BsPerson, BsList } from "react-icons/bs";
import Logo from "./Logo";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const nav = useNavigate();
  const location = useLocation();
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

  const getBorderStyle = (path) => {
    return location.pathname === path
      ? "border-l-4 border-violet-400"
      : "border-transparent";
  };

  return (
    <div
      className={`h-screen w-full md:w-[20%] bg-white rounded-r-xl ${
        isOpen ? "block" : "hidden"
      } md:block`}
    >
      <Logo />
      <div className="md:hidden absolute top-0 left-0 m-4">
        <button onClick={toggleSidebar}>
          <BsX size={24} />
        </button>
      </div>

      <div className="p-4 flex flex-col items-center">
        <div className="flex-grow flex flex-col justify-center items-center mt-4 w-full">
          <button
            onClick={goToProfile}
            className={`flex items-center p-2 w-full text-left ${getBorderStyle(
              `/profile/${user?.id}`
            )} hover:bg-gray-200`}
          >
            {/* <BsPerson className="mr-2" size={20} />  */}
            Profile
          </button>

          <button
            onClick={goToTest}
            className={`flex items-center p-2 w-full mt-2 text-left ${getBorderStyle(
              "/"
            )} hover:bg-gray-200`}
          >
            {/* <BsList className="mr-2" size={20} />  */}
            Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
