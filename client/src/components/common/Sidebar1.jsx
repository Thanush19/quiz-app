import React, { useContext, useState } from "react";
import logo from "../../assets/logo.jpg";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { BsX, BsPerson, BsList } from "react-icons/bs";
import Logo from "./Logo";

const Sidebar1 = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [isBorderApplied, setIsBorderApplied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const goToProfile = () => {
    if (user) {
      nav(`/profile/${user.id}`);
      setIsBorderApplied(true);
      setIsSidebarOpen(false);
    }
  };

  const goToTest = () => {
    if (user) {
      nav("/");
      setIsBorderApplied(true);
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isProfilePath = matchPath("/profile/:id", location.pathname);

  return (
    <>
      <div className="md:hidden">
        <button onClick={toggleSidebar} className="p-4">
          <BsList />
        </button>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-screen rounded-3xl bg-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-[15rem] w-[40%] z-20`}
      >
        <div className="flex justify-start items-start p-10">
          <img
            src={logo}
            alt="Logo"
            className="w-[90%] h-[50%] md:w-[100%] md:h-[10%] rounded-t-xl"
          />
        </div>
        <div>
          <div
            className={`flex items-center h-[2rem] ${
              location.pathname === "/"
                ? "border-l-4 border-violet-600 bg-gray-100 "
                : ""
            }`}
          >
            <div className="flex justify-center items-center ml-[2rem]">
              <BsList />
              <button onClick={goToTest} className="ml-4">
                Test
              </button>
            </div>
          </div>
          <div
            className={`flex items-center mt-4 h-[2rem] ${
              isProfilePath ? "border-l-4 border-violet-600 bg-gray-100 " : ""
            }`}
          >
            <div className="flex justify-center items-center ml-[2rem]">
              <BsPerson />
              <button className="ml-4" onClick={goToProfile}>
                Profile
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="absolute top-0 right-0 mt-4 mr-4 md:hidden"
        >
          <BsX />
        </button>
      </div>
    </>
  );
};

export default Sidebar1;
