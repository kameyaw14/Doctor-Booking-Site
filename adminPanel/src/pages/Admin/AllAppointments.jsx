import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../contexts/AdminContext";
import { AppContext } from "../../contexts/AppContext";
import { assets } from "../../assets/assets_admin/assets";

const AllAppointments = () => {
  const { aToken, GetAllAppointments, appointments, CancelAppointment } =
    useContext(AdminContext);
  const { CalculateAge, transformDate, currencySymbol } =
    useContext(AppContext);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    GetAllAppointments();
  }, [aToken]);

  // Filtered appointments based on the current filter
  const filteredAppointments = appointments.filter((appointment) => {
    if (!filter) return true;
    if (filter === "completed") return appointment.isCompleted;
    if (filter === "cancelled") return appointment.cancelled;
    if (filter.startsWith("doctor_")) {
      const doctorname = filter.split("doctor_")[1];
      return appointment.docData.docName === doctorname;
    }
    return true;
  });

  // Create a list of unique doctors from appointments for filtering
  const uniqueDoctors = [
    ...new Set(appointments.map((item) => item.docData.docName)),
  ];

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      {/* Filter Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className=" py-2 px-4 rounded-full hover:bg-primary  hover:text-white transition-all"
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className="py-2 px-4 rounded-full hover:bg-primary  hover:text-white transition-all"
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className="py-2 px-4 rounded-full hover:bg-primary  hover:text-white transition-all"
        >
          Cancelled
        </button>
        <select
          onChange={(e) => setFilter(`doctor_${e.target.value}`)}
          className="rounded-full px-5 "
        >
          <option value="">Select Doctor</option>
          {uniqueDoctors.map((doctorName, index) => (
            <option value={doctorName} key={index}>
              {doctorName}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {filteredAppointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] text-gray-500 py-3 px-6 border-b hover:bg-gray-300"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                src={item.userData.userImage}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />{" "}
              <p>{item.userData.userName}</p>
            </div>

            <p className=" max-sm:hidden">
              {CalculateAge(item.userData.userDoB)}
            </p>

            <p>
              {transformDate(item.slotDate)}, {item.slotTime}
            </p>

            <div className="flex items-center gap-2  ">
              <img
                src={item.docData.docImage}
                alt=""
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
              />{" "}
              <p>{item.docData.docName}</p>
            </div>
            <p>{currencySymbol + item.docData.docFee}</p>
            {item.cancelled ? (
              <p className=" text-red-400 font-medium text-xs">Cancelled</p>
            ) : item.isCompleted ? (
              <p className=" text-green-400 font-medium text-xs">Completed</p>
            ) : (
              <img
                className=" w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt=""
                onClick={() => CancelAppointment(item._id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
