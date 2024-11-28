import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../contexts/DoctorContext";
import { AppContext } from "../../contexts/AppContext";
import { assets } from "../../assets/assets_admin/assets";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    GetAppointments,
    CompleteAppointment,
    CancelAppointment,
  } = useContext(DoctorContext);
  const { CalculateAge, currencySymbol, formatDate } = useContext(AppContext);

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null); // Store current appointment for cancellation or completion

  useEffect(() => {
    if (dToken) {
      GetAppointments();
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
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p className="text-center">Date & Time</p>
          <p>Fee</p>
        </div>

        {appointments.reverse().map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2 ">
              <Link
                to={`/doctor-appointments/${item._id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={item.userData.userImage}
                  alt=""
                  className="w-8 rounded-full h-8 object-cover"
                />
                <p>{item.userData.userName}</p>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
