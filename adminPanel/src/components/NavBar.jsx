import React, { useContext } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../contexts/DoctorContext";

const NavBar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const HandleLogout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs ">
        <img
          onClick={() => navigate("/")}
          src={assets.admin_logo}
          alt=""
          className="w-36 sm:w-40 cursor-pointer "
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={HandleLogout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Log Out
      </button>
    </div>
  );
};

export default NavBar;
