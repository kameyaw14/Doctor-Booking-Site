import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../contexts/AdminContext";

const DoctorsList = () => {
  const { aToken, doctors, GetAllDoctors, ChangeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      GetAllDoctors();
    }
  }, [aToken]);

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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorsList;
