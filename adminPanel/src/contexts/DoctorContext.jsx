import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  // variables
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // State variables
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // functions
  const GetAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/doctors/appointments",
        { headers: { dToken } }
      );

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  const CompleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/doctors/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        GetAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  const CancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/doctors/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        GetAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  const GetDashData = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/doctors/doctor-dashboard",
        { headers: { dToken } }
      );

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  const GetDoctorProfileData = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/doctors/doctor-profile",
        { headers: { dToken } }
      );

      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  // values
  const value = {
    backendURL,
    dToken,
    setDToken,
    appointments,
    setAppointments,
    GetAppointments,
    CompleteAppointment,
    CancelAppointment,
    GetDashData,
    dashData,
    setDashData,
    profileData,
    setProfileData,
    GetDoctorProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
