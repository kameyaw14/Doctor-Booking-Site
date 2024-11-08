import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

// Component to manage doctor appointment scheduling
const Appointments = () => {
  const navigate = useNavigate();
  const { docId } = useParams(); // Retrieve doctor ID from URL parameters
  const { doctors, currencySymbol, GetDoctorsData, backendURL, token } =
    useContext(AppContext); // Destructure context values
  const [docInfo, setDocInfo] = useState(null); // State to store selected doctor’s information
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; // Days of the week for display

  const [docSlots, SetDocSlots] = useState([]); // Available time slots for the doctor
  const [slotIndex, SetSlotIndex] = useState(0); // Currently selected date index
  const [slotTime, SetSlotTime] = useState(""); // Currently selected time slot
  const [disable, setDisable] = useState(false);

  // Fetches and sets available time slots for the next 30 days
  const GetAvailableSlots = async () => {
    SetDocSlots([]); // Reset slots before fetching new ones

    // Getting the current date
    let today = new Date();
    for (let i = 0; i < 30; i++) {
      // Loop for 30 days
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Setting end time for slots (9 PM)
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Initializing slots for the current day
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = []; // Array to hold time slots for the day

      // Creating time slots in 30-minute intervals
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // let day = currentDate.getDate();
        // let month = currentDate.getMonth() + 1;
        // let year = currentDate.getFullYear();

        // const slotDate = day + "_" + month + "_" + year;
        // const slotTime = formattedTime;

        // // Check if slot is available by cross-referencing booked slots
        // const isSlotAvailable =
        //   docInfo.slotsBooked[slotDate] &&
        //   docInfo.slotsBooked[slotDate].includes(slotTime)
        //     ? false
        //     : true;

        // if (isSlotAvailable) {
        // }

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30); // Increment by 30 minutes
      }

      SetDocSlots((prev) => [...prev, timeSlots]); // Add day's slots to state
    }
  };

  // Fetch doctor’s information based on docId from context doctors array
  const fetchDocInfo = async () => {
    const newDocInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(newDocInfo);
  };

  // Handle appointment booking
  const BookAppointment = async () => {
    if (!token) {
      // Check if user is logged in
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendURL + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        setDisable(true);
        toast.success(data.message); // Notify success
        GetDoctorsData(); // Refresh doctor data after booking
        navigate("/my-appointments");
      } else {
        toast.error(data.message); // Notify error if booking failed
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message); // Display error message
    }
  };

  // Fetch doctor info when component mounts or doctor changes
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  // Fetch available slots when doctor info is available
  useEffect(() => {
    GetAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots); // Log slots for debugging
  }, [docSlots]);

  return (
    docInfo && ( // Render only if doctor info is available
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Doctor Image */}
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.docImage}
              alt=""
            />
          </div>
          <div className="flex-1 border  border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* Doctor Name, Degree, and Experience */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img className="w-5" src={Assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.docDegree} - {docInfo.docSpeciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.docExperience}
              </button>
            </div>
            {/* Doctor About Section */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={Assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.docAbout}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.docFee}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          {/* Display available dates */}
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, id) => (
                <div
                  onClick={() => SetSlotIndex(id)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer${
                    slotIndex === id
                      ? " bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={id}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          {/* Display available times for the selected date */}
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, id) => {
                const date = item.datetime; // Assuming item.datetime is a Date object

                // Extract the date from the datetime object
                let day = date.getDate();
                let month = date.getMonth() + 1; // Months are 0-based in JS
                let year = date.getFullYear();

                const slotDate = `${day}_${month}_${year}`; // Formatted as "day_month_year"

                // Check if the slot is booked or if it's disabled
                const isBooked = docInfo.slotsBooked?.[slotDate]?.includes(
                  item.time
                ); // Check if this slot is booked
                const isDisabled = disable || isBooked; // Disable slot if already booked or if an appointment is made

                return (
                  <p
                    onClick={() => {
                      if (isDisabled) {
                        // Show toast when trying to select a disabled slot
                        toast.warn(
                          "This slot is already booked or unavailable!",
                          {
                            position: "top-center", // Position of the toast
                            autoClose: 3000, // Duration of the toast (in ms)
                            hideProgressBar: false, // Hide the progress bar
                            closeOnClick: true, // Close on click
                            pauseOnHover: true, // Pause when hovered
                            draggable: true, // Allow dragging
                            progress: undefined, // Progress indicator
                          }
                        );
                      } else {
                        // If not disabled, proceed with setting the slot time
                        SetSlotTime(item.time);
                      }
                    }} // Only select if not disabled
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                      item.time === slotTime
                        ? "bg-primary text-white"
                        : "text-gray-400 border border-gray-300"
                    } ${isDisabled ? "bg-gray-200 cursor-not-allowed" : ""}`} // Disable slot style
                    key={id}
                  >
                    {item.time.toLowerCase()}
                  </p>
                );
              })}
          </div>

          {/* Book Appointment Button */}
          <button
            onClick={BookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full py-6 mt-6"
          >
            Book an appointment
          </button>
        </div>

        {/* Related Doctors Section */}
        <RelatedDoctors docId={docId} docSpeciality={docInfo.docSpeciality} />
      </div>
    )
  );
};

export default Appointments;
