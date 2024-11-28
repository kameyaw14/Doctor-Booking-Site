import React from "react";
import { Assets } from "../../assets/assets_frontend/assets";

const Header = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-6 lg:px-16">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0">
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-wide">
            Book Your Appointment with Trusted Doctors
          </h1>
          <p className="text-lg font-light max-w-md">
            Easily browse through a list of expert doctors and schedule your
            consultation in just a few clicks.
          </p>
          <a
            href="#speciality"
            className="inline-flex items-center bg-white text-gray-800 px-8 py-3 rounded-full text-base font-medium shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Book Appointment
            <img
              className="w-4 ml-2"
              src={Assets.arrow_icon}
              alt="Arrow Icon"
            />
          </a>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <img
            className="w-80 md:w-96 lg:w-full h-auto rounded-lg shadow-lg"
            src={Assets.header_img}
            alt="Doctor Consultation"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
