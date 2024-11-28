import axios from "axios";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DoctorContext } from "../../contexts/DoctorContext";
import { AppContext } from "../../contexts/AppContext";

const PatientInfo = () => {
  const { appointmentId } = useParams();
  // console.log("appId: " + appointmentId);

  const { backendURL, dToken } = useContext(DoctorContext);
  const { CalculateAge } = useContext(AppContext);
  const [patientData, setPatientData] = useState(null);
  const [docInfo, setDocInfo] = useState(null); // New state for doctor info
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; // Days of the week for display

  const [docSlots, SetDocSlots] = useState([]); // Available time slots for the doctor
  const [slotIndex, SetSlotIndex] = useState(0); // Currently selected date index
  const [slotTime, SetSlotTime] = useState(""); // Currently selected time slot
  const [disable, setDisable] = useState(false); // Controls if slots should be disabled

  const GetAvailableSlots = async () => {
    SetDocSlots([]); // Reset slots before fetching new ones

    let today = new Date();
    for (let i = 0; i < 30; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30); // Increment by 30 minutes
      }

      SetDocSlots((prev) => [...prev, timeSlots]); // Add day's slots to state
    }
  };

  const FetchPatientData = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/doctors/appointment/${appointmentId}`,
        { headers: { dToken } }
      );
      if (data.success) {
        setPatientData(data.appointment);
        setDocInfo(data.appointment.docData); // Assuming doctor info comes with the patient data
        console.log("Doctor Info:", data.appointment.docData); // Debugging line to verify doctor info
      } else {
        toast.error(data.message || "Failed to load appointment data");
        console.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching appointment data");
      console.error("Error fetching appointment data:", error);
    }
  };

  useEffect(() => {
    FetchPatientData();
  }, [appointmentId]);

  useEffect(() => {
    // if (patientData && docInfo) {
    GetAvailableSlots();
    // }
  }, [patientData, docInfo]);

  const patientAge = useMemo(() => {
    return patientData?.userData?.userDoB
      ? CalculateAge(patientData.userData.userDoB)
      : null;
  }, [patientData, CalculateAge]);

  const bookAppointment = async () => {
    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }

    if (!docInfo || !docInfo._id) {
      toast.error("Doctor information is missing or invalid");
      return;
    }

    // Extract required data from patientData and docInfo
    const userId = patientData.userData._id; // Assuming _id exists in userData
    const userData = {
      name: patientData.userData.userName,
      email: patientData.userData.userEmail,
      phone: patientData.userData.userPhone,
      image: patientData.userData.userImage,
    };
    const docData = {
      id: docInfo._id,
      name: docInfo.docName, // Assuming doctor name is available in docInfo
      specialization: docInfo.docSpeciality, // If specialization is available
    };
    const amount = docInfo.docFee || 0; // Assuming fee is available in docInfo

    const selectedDate = docSlots[slotIndex][0].datetime;
    const slotDate = `${selectedDate.getDate()}_${
      selectedDate.getMonth() + 1
    }_${selectedDate.getFullYear()}`;

    // Log data to ensure it's correct before sending
    console.log("Sending data:", {
      userId,
      userData,
      docData,
      amount,
      slotDate,
      slotTime,
      docId: docInfo._id,
    });

    try {
      const response = await axios.post(
        `${backendURL}/api/doctors/set-appointment`,
        {
          userId,
          userData,
          docData,
          amount,
          slotDate,
          slotTime,
          docId: docInfo._id,
        },
        { headers: { dToken } }
      );

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
        // Update the UI to reflect the booked slot
        SetDocSlots((prevSlots) => {
          const updatedSlots = [...prevSlots];
          updatedSlots[slotIndex] = updatedSlots[slotIndex].map((slot) => {
            if (slot.time === slotTime) {
              slot.isBooked = true;
            }
            return slot;
          });
          return updatedSlots;
        });
      } else {
        toast.error(response.data.message || "Failed to book appointment");
      }
    } catch (error) {
      toast.error("An error occurred while booking the appointment");
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-hidden bg-gray-50 rounded-lg shadow-md">
      {patientData?.userData ? (
        <>
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            {patientData.userData.userName}'s Profile
          </h1>

          <div className="flex items-center space-x-6 mb-6">
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

          <div className="text-lg text-gray-700 mt-6">
            <h2 className="font-medium text-xl">Address:</h2>
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

          <div className="text-lg text-gray-700 mt-6 border p-10">
            <h2 className="font-medium text-2xl sm:text-5xl">
              Patient's Condition:
            </h2>
            <p className="font-semibold pt-7 pl-7 sm:text-2xl">
              {patientData.symptoms}
            </p>
          </div>

          {/* Set date and time slot */}
          <div className="mt-6">
            <p className="font-medium text-gray-700">Booking Slots</p>

            {/* Display available dates with horizontal scroll */}
            <div className="flex gap-4 items-center overflow-x-auto mt-4">
              {docSlots.length &&
                docSlots.map((item, id) => (
                  <div
                    onClick={() => SetSlotIndex(id)}
                    className={`text-center py-6 px-8 min-w-20 rounded-lg cursor-pointer transition-colors ${
                      slotIndex === id
                        ? "bg-primary text-white"
                        : "border border-gray-200 hover:border-gray-400"
                    }`}
                    key={id}
                  >
                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p>{item[0] && item[0].datetime.getDate()}</p>
                  </div>
                ))}
            </div>

            {/* Display available times for the selected date with horizontal scroll */}
            <div className="overflow-x-auto mt-4">
              <div className="flex gap-4 items-center w-max">
                {docSlots.length &&
                  docSlots[slotIndex].map((item, id) => {
                    const date = item.datetime;
                    let day = date.getDate();
                    let month = date.getMonth() + 1;
                    let year = date.getFullYear();
                    const slotDate = `${day}_${month}_${year}`;
                    const isBooked = docInfo?.slotsBooked?.[slotDate]?.includes(
                      item.time
                    );
                    const isDisabled = disable || isBooked;

                    return (
                      <p
                        onClick={() => {
                          if (isDisabled) {
                            toast.warn(
                              "This slot is already booked or unavailable!"
                            );
                          } else {
                            SetSlotTime(item.time);
                          }
                        }}
                        className={`text-sm font-light flex-shrink-0 px-6 py-3 rounded-full cursor-pointer transition-colors ${
                          item.time === slotTime
                            ? "bg-primary text-white"
                            : "text-gray-400 border border-gray-300 hover:border-gray-500"
                        } ${
                          isDisabled ? "bg-gray-200 cursor-not-allowed" : ""
                        }`}
                        key={id}
                      >
                        {item.time.toLowerCase()}
                      </p>
                    );
                  })}
              </div>
            </div>

            {/* Book Appointment Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={bookAppointment}
                className="bg-primary text-white text-sm font-light px-16 py-3 rounded-full shadow-md hover:bg-primary-dark transition"
              >
                Book an Appointment
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading patient data...</p>
      )}
    </div>
  );
};

export default PatientInfo;
