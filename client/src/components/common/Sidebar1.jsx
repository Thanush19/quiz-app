import React, { useContext, useState } from "react";
import logo from "../../assets/logo.jpg";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { BsX, BsPerson, BsList } from "react-icons/bs";
import Logo from "./Logo";
import menu from "../../assets/menu.svg";

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
        className={`fixed top-0 left-0 h-screen md:rounded-r-[36px] rounded-r-[20px]  bg-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-[20%] z-20`}
      >
        <p className="text-ind font-bold md:text-3xl text-xl mt-[10%] text-center ">
          <span className="uppercase">ø</span>endo
        </p>

        <div className="mt-[30%]">
          <div
            className={`flex items-center h-[2rem] ${
              location.pathname === "/"
                ? "border-l-4 border-ind bg-gray-50 rounded-r-lg "
                : ""
            }`}
          >
            <div className="flex justify-center items-center ml-[11%]">
              <img src={menu} />
              <button onClick={goToTest} className="ml-4 text-md text-ind ">
                Tests
              </button>
            </div>
          </div>
          <div
            className={`flex items-center mt-4 h-[2rem] ${
              isProfilePath
                ? "border-l-4 border-ind rounded-r-lg bg-gray-100 "
                : ""
            }`}
          >
            <div className="flex justify-center items-center ml-[11%]">
              <BsPerson className="text-ind w-[1.5rem]  h-auto" />
              <button className="ml-4 text-ind" onClick={goToProfile}>
                Profile
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="absolute -top-3 -right-2 mt-4 mr-4 md:hidden"
        >
          <BsX />
        </button>
      </div>
    </>
  );
};

export default Sidebar1;
