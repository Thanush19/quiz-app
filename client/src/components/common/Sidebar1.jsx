import React, { useContext } from "react";
import logo from "../../assets/logo.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { BsX, BsPerson, BsList } from "react-icons/bs";
import Logo from "./Logo";

const Sidebar1 = () => {
  return (
    <>
      <div>
        <img
          src={logo}
          alt="Logo"
          className="w-[50%] h-[50%] md:w-[100%] md:h-[10%]  rounded-t-xl"
        />
        <div>
          <div className="flex  items-center ">
            <BsList />
            <button>Test</button>
          </div>
          <div className="flex  items-center ">
            <BsPerson />
            <button>Profile</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar1;
