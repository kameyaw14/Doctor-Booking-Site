import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments1 = () => {
  const { backendURL, token, SlotDateFormat, GetDoctorsData } =
    useContext(AppContext);

  const [appointments, setAppointments] = useState([]);

  const GetUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/user/appointments-list",
        { headers: { token } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const HandleCancelAppointments = async (appointmentId) => {
    try {
      // console.log(appointmentId);
      const { data } = await axios.post(
        backendURL + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        GetUserAppointments();
        GetDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const HandleDeleteAppointment = async (appointmentId, userId) => {
    try {
      const { data } = await axios.delete(
        backendURL + "/api/user/delete-appointment",
        {
          headers: { token },
          data: { userId, appointmentId },
        }
      );

      if (data.success) {
        toast.success(data.message);
        GetUserAppointments();
        GetDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      GetUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      {appointments.length > 0 ? (
        <div>
          {appointments.map((item, id) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:gap-6 py-2 border-b "
              key={id}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData.docImage}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm">
                <p className="text-neutral-800 font-semibold">
                  {item.docData.docName}
                </p>
                <p>{item.docData.docSpeciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.docAddress.line1}</p>
                <p className="text-xs">{item.docData.docAddress.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:
                  </span>
                  {SlotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex justify-end gap-5">
                {!item.cancelled && (
                  <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border  rounded hover:bg-primary hover:text-white transition-all duration-300">
                    Pay Online
                  </button>
                )}
                {!item.cancelled && (
                  <button
                    onClick={() => HandleCancelAppointments(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border  rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}
                {item.cancelled && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
                {item.cancelled && (
                  <button
                    onClick={() =>
                      HandleDeleteAppointment(item._id, item.userId)
                    }
                    className="sm:min-w-48 py-2 border border-red-500 bg-red-500 rounded text-white"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no appointments booked</p>
      )}
    </div>
  );
};

export default MyAppointments1;
