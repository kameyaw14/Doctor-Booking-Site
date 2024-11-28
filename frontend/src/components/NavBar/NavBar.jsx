import React, { useContext, useState } from "react";
import { Assets } from "../../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { AppContext } from "../../context/AppContext";

const NavBar = () => {
  const navigate = useNavigate();

  const { token, setToken, userData } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);

  const Logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="navBarDiv mb-10">
      <img
        onClick={() => navigate("/")}
        className="navLogo cursor-pointer w-44"
        src={Assets.logo}
        alt=""
      />
      <ul className="navItems hidden lg:flex items-start gap-5 font-medium">
        <NavLink to={"/"}>
          <li className="py-1">Home</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1">All doctors</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/about"}>
          <li className="py-1">about</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/contact"}>
          <li className="py-1">contact</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>

        <a
          href="https://doctor-booking-site-4-admin.onrender.com/"
          target="_blank"
          className="hidden md:block  bg-primary text-white py-1 px-3 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
        >
          Admin Page
        </a>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex gap-2 items-center group relative">
            <img
              className="w-8 h-8 object-cover rounded-full"
              src={userData.userImage}
              alt="profile"
            />
            <img className="w-2.5" src={Assets.dropdown_icon} alt="profile" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={Logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="chiefBtn hidden md:block"
          >
            create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 lg:hidden"
          src={Assets.menu_icon}
          alt=""
        />
        {/* mobileMenu */}
        <div className={`mobileMenu ${showMenu ? "" : "hidden"}`}>
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={Assets.logo} alt="" />
            <img
              className="w-7"
              src={Assets.cross_icon}
              alt=""
              onClick={() => setShowMenu(false)}
            />
          </div>
          <ul className="flex flex-col items-center   gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink to="/" onClick={() => setShowMenu(false)}>
              <p> Home </p>
            </NavLink>
            <NavLink to="/doctors" onClick={() => setShowMenu(false)}>
              <p>All Doctors </p>
            </NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)}>
              <p> About Us </p>
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)}>
              <p> Contact </p>
            </NavLink>
            <a
              href="https://doctor-booking-site-4-admin.onrender.com/"
              target="_blank"
              className="  bg-primary text-white py-1 px-3 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Admin Page
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
