import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../contexts/AdminContext";
import { assets } from "../../assets/assets_admin/assets";

const Dashboard = () => {
  const { GetDashboardData, aToken, CancelAppointment, dashData,transformDate } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      GetDashboardData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className=" m-5">
        <div className=" flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className=" w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className=" text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className=" text-gray-400">Doctors</p>
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
              <div key={index} className=" flex items-center px-6 py-3 gap-3 hover:bg-gray-100">
                <img className="rounded-full w-10 h-10 object-cover" src={item.docData.docImage} alt="" />
                <div className="flex-1 text-sm">
                  <p className=" text-gray-800 font-medium">{item.docData.docName}</p>
                  <p className="text-gray-600">{transformDate(item.slotDate)}</p>
                  <p className="text-gray-600">{item.slotTime}</p>
                </div>
                {item.cancelled ? (
                  <p className=" text-red-400 font-medium text-xs">Cancelled</p>
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
      </div>
    )
  );
};

export default Dashboard;