import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../contexts/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets_admin/assets";

const DoctorsList = () => {
  const { aToken, doctors, GetAllDoctors, ChangeAvailability, RemoveDoctor } =
    useContext(AdminContext);

  const [showPopup, setShowPopup] = useState(false); // State for the popup visibility
  const [doctorToRemove, setDoctorToRemove] = useState(null); // Track doctor to remove

  useEffect(() => {
    if (aToken) {
      GetAllDoctors();
    }
  }, [aToken]);

  // Function to show the popup
  const handleRemoveClick = (docId) => {
    setDoctorToRemove(docId);
    setShowPopup(true); // Show the confirmation popup
  };

  // Function to confirm removal
  const handleConfirmRemove = () => {
    if (doctorToRemove) {
      RemoveDoctor(doctorToRemove); // Call the remove function
    }
    setShowPopup(false); // Hide the popup after action
  };

  // Function to cancel removal
  const handleCancelRemove = () => {
    setShowPopup(false); // Simply close the popup if cancelled
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => {
          return (
            <div
              key={index}
              className="border bg-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            >
              <img
                src={item.docImage}
                alt={item.docName}
                className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              />

              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">
                  {item.docName}
                </p>
                <p className="text-zinc-600 text-sm">{item.docSpeciality}</p>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={item.docAvailabilty}
                    onChange={() => ChangeAvailability(item._id)}
                  />
                  <p>Available</p>
                  <img
                    src={assets.cancel_icon}
                    alt=""
                    className="ml-14"
                    onClick={() => handleRemoveClick(item._id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3 text-center">
            <h2 className="text-lg font-medium">
              Are you sure you want to remove this doctor?
            </h2>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={handleConfirmRemove}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={handleCancelRemove}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
