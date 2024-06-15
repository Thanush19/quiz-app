import React from "react";
import logo from "../assets/logo.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { BsX, BsPerson, BsList } from "react-icons/bs";

const Dashboard = ({ isOpen, toggleSidebar }) => {
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

  const isActive = (path) => {
    return location.pathname === path;
  };
  return <div>Dashboard</div>;
};

export default Dashboard;
