import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../contexts/DoctorContext";
import Modal from "./Modal";

const NavBar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

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
        onClick={() => setOpen(true)}
        className="bg-primary text-white text-sm lg:px-10 lg:py-2 px-5 py-1 rounded-full "
      >
        Log Out
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-center  max-w-sm mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-evenly gap-4">
              <button
                onClick={HandleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NavBar;
