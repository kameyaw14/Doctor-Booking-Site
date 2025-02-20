import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./contexts/AdminContext";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import { DoctorContext } from "./contexts/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import PatientInfo from "./pages/Doctor/PatientInfo";
import BookedAppointments from "./pages/Doctor/BookedAppointments";

function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <>
      <div className="bg-[#F8F9FD]">
        <ToastContainer />
        <NavBar />
        <div className="flex items-start">
          <Sidebar />
          <Routes>
            {/* adminRoutes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route
              path="/booked-appointments"
              element={<BookedAppointments />}
            />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorsList />} />
            {/* DoctorRoutes */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route
              path="/doctor-appointments"
              element={<DoctorAppointments />}
            />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route
              path="/doctor-appointments/:appointmentId"
              element={<PatientInfo />}
            />
          </Routes>
        </div>
      </div>
    </>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App;
