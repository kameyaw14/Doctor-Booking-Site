import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", backendURL);

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  //transform date
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const transformDate = (dateString) => {
    const dateArray = dateString.split("_");
    const month = months[Number(dateArray[1]) - 1]; // Adjust for zero-indexing
    const day = dateArray[0];
    const year = dateArray[2];

    return `${month} ${day}, ${year}`;
  };

  const GetAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const ChangeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        GetAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const GetAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/admin/appointments", {
        headers: { aToken },
      });

      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const CancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        GetAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };

  const GetDashboardData = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/admin/admin-dashboard",
        { headers: { aToken } }
      );

      if (data.success) {
        setDashData(data.dashboardData);
        console.log(data.dashboardData);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      
    }
  };

  const value = {
    aToken,
    setAToken,
    backendURL,
    doctors,
    GetAllDoctors,
    ChangeAvailability,
    GetAllAppointments,
    appointments,
    CancelAppointment,
    GetDashboardData,
    dashData,
    transformDate,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
