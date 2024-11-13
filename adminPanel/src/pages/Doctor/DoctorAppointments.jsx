import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../contexts/DoctorContext";
import { AppContext } from "../../contexts/AppContext";
import { assets } from "../../assets/assets_admin/assets";
import { Link } from "react-router-dom";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    GetAppointments,
    CompleteAppointment,
    CancelAppointment,
  } = useContext(DoctorContext);
  const { CalculateAge, transformDate, currencySymbol } =
    useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      GetAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {appointments.reverse().map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2 ">
              <Link
                to={`/patient/${item.userData._id}`}
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
            <p>
              {transformDate(item.slotDate)}, {item.slotTime}
            </p>
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
                  onClick={() => CancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                />
                <img
                  src={assets.tick_icon}
                  alt=""
                  onClick={() => CompleteAppointment(item._id)}
                  className="w-10 cursor-pointer"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
