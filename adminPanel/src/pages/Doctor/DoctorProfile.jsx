import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../contexts/DoctorContext";
import { AppContext } from "../../contexts/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const {
    dToken,
    profileData,
    setProfileData,
    GetDoctorProfileData,
    backendURL,
  } = useContext(DoctorContext);
  const { currencySymbol } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const UpdateProfile = async () => {
    try {
      const updatedProfile = {
        docFee: profileData.docFee,
        docAddress: profileData.docAddress,
        docAvailabilty: profileData.docAvailabilty,
      };

      const { data } = await axios.post(
        backendURL + "/api/doctors/doctor-update-profile",
        updatedProfile,
        { headers: { dToken } }
      );

      if (data.success) {
        GetDoctorProfileData();
        toast.success(data.message);
        setIsEdit(false);
      } else {
        toast.error("Connection lost");
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      GetDoctorProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              src={profileData.docImage}
              alt=""
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
            />
          </div>

          <div className=" flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* Doc name degree and experience */}
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.docName}
            </p>
            <div className="flex items-center gap-2 mt-1 to-gray-600">
              {profileData.docDegree} - {profileData.docSpeciality}
              <button className="py-0.5 px-2 gap-1 text-xs rounded-full border">
                {profileData.docExperience}
              </button>
            </div>

            {/* about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium to-neutral-800 mt-3">
                About:{" "}
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {profileData.docAbout}
              </p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currencySymbol}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        docFee: e.target.value,
                      }))
                    }
                    value={profileData.docFee}
                  />
                ) : (
                  profileData.docFee
                )}
              </span>
            </p>

            <div className="flex flex-col gap-2 py-2">
              <p>Address: </p>
              {isEdit ? (
                <>
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        docAddress: {
                          ...prev.docAddress,
                          line1: e.target.value,
                        },
                      }))
                    }
                    value={profileData.docAddress.line1 || ""}
                    className="mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        docAddress: {
                          ...prev.docAddress,
                          line2: e.target.value,
                        },
                      }))
                    }
                    value={profileData.docAddress.line2 || ""}
                  />
                </>
              ) : (
                <p className="text-sm">
                  {profileData.docAddress.line1} <br />
                  {profileData.docAddress.line2}
                </p>
              )}
            </div>

            <div className="flex gap-1 pt-2">
              <input
                type="checkbox"
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    docAvailabilty: !prev.docAvailabilty,
                  }))
                }
                className="cursor-pointer"
                checked={profileData.docAvailabilty}
              />
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={UpdateProfile}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
