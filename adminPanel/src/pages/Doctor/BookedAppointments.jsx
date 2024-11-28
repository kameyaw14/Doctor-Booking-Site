import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../contexts/DoctorContext";
import { AppContext } from "../../contexts/AppContext";
import { assets } from "../../assets/assets_admin/assets";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";

const BookedAppointments = () => {
  const {
    dToken,
    appointments,
    GetAppointments,
    CompleteAppointment,
    CancelAppointment,
    bookedAppointments,
    setBookedAppointments,
    GetBookedAppointments,
  } = useContext(DoctorContext);
  const { CalculateAge, currencySymbol, formatDate } = useContext(AppContext);

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null); // Store current appointment for cancellation or completion

  useEffect(() => {
    if (dToken) {
      GetBookedAppointments();
    }
  }, [dToken]);

  // Open cancel modal and set the appointment to be canceled
  const openCancelAppointmentModal = (appointment) => {
    setCurrentAppointment(appointment);
    setOpenCancelModal(true);
  };

  // Open complete modal and set the appointment to be completed
  const openCompleteAppointmentModal = (appointment) => {
    setCurrentAppointment(appointment);
    setOpenCompleteModal(true);
  };

  const handleCancel = () => {
    if (currentAppointment) {
      CancelAppointment(currentAppointment._id); // Cancel the appointment
    }
    setOpenCancelModal(false); // Close cancel modal
  };

  const handleComplete = () => {
    if (currentAppointment) {
      CompleteAppointment(currentAppointment._id); // Complete the appointment
    }
    setOpenCompleteModal(false); // Close complete modal
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p className="text-center">Date & Time</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {bookedAppointments.reverse().map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2 ">
              <Link
                // to={`/doctor-appointments/${item._id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={item.userData.image}
                  alt=""
                  className="w-8 rounded-full h-8 object-cover"
                />
                <p>{item.userData.name}</p>
              </Link>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "Cash"}
              </p>
            </div>
            <p className="max-sm:hidden">
              {CalculateAge(item.userData.userDoB)}
            </p>
            <p className="text-center">{formatDate(item.date)}</p>
            <p>
              {currencySymbol} {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-600 font-medium text-xs">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-600 font-medium text-xs">Completed</p>
            ) : (
              <div className="flex">
                <img
                  src={assets.cancel_icon}
                  alt=""
                  onClick={() => openCancelAppointmentModal(item)} // Open cancel modal
                  className="w-10 cursor-pointer"
                />
                <img
                  src={assets.tick_icon}
                  alt=""
                  onClick={() => openCompleteAppointmentModal(item)} // Open complete modal
                  className="w-10 cursor-pointer"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cancel Appointment Modal */}
      <Modal open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <div className="flex items-center justify-center max-w-sm mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Cancellation</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-evenly gap-4">
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenCancelModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Complete Appointment Modal */}
      <Modal
        open={openCompleteModal}
        onClose={() => setOpenCompleteModal(false)}
      >
        <div className="flex items-center justify-center max-w-sm mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Completion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to mark this appointment as completed?
            </p>
            <div className="flex justify-evenly gap-4">
              <button
                onClick={handleComplete}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenCompleteModal(false)}
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

export default BookedAppointments;
