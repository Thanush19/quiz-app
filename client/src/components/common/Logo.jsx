import React from "react";
import logo from "../../assets/logo.jpg";
const Logo = () => {
  return (
    <div>
      <img
        src={logo}
        alt="Logo"
        className="w-[50%] h-[50%] md:w-[100%] md:h-[10%]  rounded-t-xl"
      />
    </div>
  );
};

export default Logo;
