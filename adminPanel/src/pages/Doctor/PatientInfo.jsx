import axios from "axios";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DoctorContext } from "../../contexts/DoctorContext";
import { AppContext } from "../../contexts/AppContext";

const PatientInfo = () => {
  const { userId } = useParams();
  const [patientData, setPatientData] = useState(null);
  const { backendURL, dToken } = useContext(DoctorContext);
  const { CalculateAge } = useContext(AppContext);

  const FetchPatientData = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/doctors/patient/${userId}`,
        { headers: { dToken } }
      );
      if (data.success) {
        setPatientData(data.patient);
        console.log("data: " + data);
      } else {
        toast.error(data.message || "Failed to load patient data");
        console.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching patient data");
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    FetchPatientData();
  }, [userId]);
  useEffect(() => {
    console.log("Updated patient data:", patientData);
  }, [patientData]);

  // Memoize calculated age to avoid recalculating it on every render
  const patientAge = useMemo(() => {
    return patientData?.userData?.userDoB
      ? CalculateAge(patientData.userData.userDoB)
      : null;
  }, [patientData, CalculateAge]);

  return (
    <div className="p-8 space-y-4">
      {patientData?.userData ? (
        <>
          <h1 className="text-2xl font-semibold text-gray-800">
            {patientData.userData.userName}'s Profile
          </h1>
          <div className="flex items-center space-x-6">
            <img
              src={patientData.userData.userImage}
              alt="Patient"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <div className="text-lg text-gray-700">
              <p className="font-medium">
                Email:{" "}
                <span className="text-gray-800">
                  {patientData.userData.userEmail}
                </span>
              </p>
              <p className="font-medium">
                Age: <span className="text-gray-800">{patientAge}</span>
              </p>
              <p className="font-medium">
                Gender:{" "}
                <span className="text-gray-800">
                  {patientData.userData.userGender}
                </span>
              </p>
              <p className="font-medium">
                Contact:{" "}
                <span className="text-gray-800">
                  {patientData.userData.userPhone}
                </span>
              </p>
            </div>
          </div>
          <div className="text-lg text-gray-700 mt-4">
            <h2 className="font-medium">Address:</h2>
            <p className="ml-6">
              Line 1:{" "}
              <span className="text-gray-800">
                {patientData.userData.userAddress?.line1 || "N/A"}
              </span>
            </p>
            <p className="ml-6">
              Line 2:{" "}
              <span className="text-gray-800">
                {patientData.userData.userAddress?.line2 || "N/A"}
              </span>
            </p>
          </div>
        </>
      ) : (
        <p>Loading patient data...</p>
      )}
    </div>
  );
};

export default PatientInfo;
