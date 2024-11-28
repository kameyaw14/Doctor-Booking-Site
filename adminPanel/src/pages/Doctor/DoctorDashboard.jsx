import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../contexts/DoctorContext";
import { assets } from "../../assets/assets_admin/assets";
import { AppContext } from "../../contexts/AppContext";

const DoctorDashboard = () => {
  const {
    dToken,
    GetDashData,
    dashData,
    setDashData,
    CompleteAppointment,
    CancelAppointment,
  } = useContext(DoctorContext);
  const { currencySymbol, formatDate } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      GetDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5">
        {" "}
        <div className=" flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className=" w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {currencySymbol} {dashData.earnings}
              </p>
              <p className=" text-gray-400">Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className=" w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className=" text-gray-400">appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className=" w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className=" text-gray-400">patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className=" flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className=" font-semibold">Latest Bookings</p>
          </div>

          <div className=" pt-4 border border-t-0 ">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className=" flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              >
                <img
                  className="rounded-full w-10 h-10 object-cover"
                  src={item.userData.userImage}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className=" text-gray-800 font-medium">
                    {item.userData.userName}
                  </p>
                  <p className="text-gray-600">{formatDate(item.date)}</p>
                  <p className="text-gray-600">{item.slotTime}</p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-600 font-medium text-xs">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-600 font-medium text-xs">
                    Completed
                  </p>
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
      </div>
    )
  );
};

export default DoctorDashboard;
