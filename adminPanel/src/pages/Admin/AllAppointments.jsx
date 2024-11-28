import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../contexts/AdminContext";
import { AppContext } from "../../contexts/AppContext";
import { assets } from "../../assets/assets_admin/assets";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaPrint } from "react-icons/fa";
import { BsFilterSquareFill } from "react-icons/bs";
import Modal from "../../components/Modal";

const AllAppointments = () => {
  const { aToken, GetAllAppointments, appointments, CancelAppointment } =
    useContext(AdminContext);
  const { CalculateAge, transformDate, formatDate, currencySymbol } =
    useContext(AppContext);

  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null); // State to store the appointment to be canceled

  useEffect(() => {
    GetAllAppointments();
  }, [aToken]);

  // Filtered appointments based on the current filter
  const filteredAppointments = appointments.filter((appointment) => {
    if (!filter) return true;
    if (filter === "completed") return appointment.isCompleted;
    if (filter === "cancelled") return appointment.cancelled;
    if (filter.startsWith("doctor_")) {
      const doctorname = filter.split("doctor_")[1];
      return appointment.docData.docName === doctorname;
    }
    return true;
  });

  // Create a list of unique doctors from appointments for filtering
  const uniqueDoctors = [
    ...new Set(appointments.map((item) => item.docData.docName)),
  ];

  const generatePdf = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Appointments Report", 14, 20);
    doc.setFontSize(12);

    // Column Headers
    const headers = [
      "#",
      "Patient",
      "Age",
      "Date & Time",
      "Doctor",
      "Fees",
      "Status",
    ];
    const data = filteredAppointments.map((item, index) => [
      index + 1,
      item.userData.userName,
      CalculateAge(item.userData.userDoB),
      `${formatDate(item.date)}`,
      item.docData.docName,
      `${currencySymbol + item.docData.docFee}`,
      item.cancelled ? "Cancelled" : item.isCompleted ? "Completed" : "Pending",
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("appointments_report.pdf");
  };

  const handleCancel = (appointmentId) => {
    CancelAppointment(appointmentId); // Call cancel appointment function
    setOpen(false); // Close the modal after confirming cancellation
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="flex flex-wrap justify-between items-center">
        <p className="mb-3 text-lg font-medium w-full sm:w-auto">
          All Appointments
        </p>
        <div
          onClick={generatePdf}
          className="mr-5 bg-white p-2 lg:p-5 rounded-full shadow-lg cursor-pointer "
        >
          <div className="flex gap-2 text-sm lg:text-lg font-medium">
            Print
            <FaPrint size={20} />
          </div>
        </div>
        {/* Filter Toggle Button for mobile */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden p-3 rounded-full bg-primary text-white mb-5"
        >
          <BsFilterSquareFill size={20} />
        </button>
      </div>

      {/* Filter Controls - Initially hidden on mobile */}
      <div
        className={`mb-4 flex flex-wrap gap-2 ${
          showFilters ? "block" : "hidden sm:flex"
        }`}
      >
        <button
          onClick={() => setFilter("all")}
          className="py-2 px-4 rounded-full hover:bg-primary hover:text-white transition-all w-full sm:w-auto"
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className="py-2 px-4 rounded-full hover:bg-primary hover:text-white transition-all w-full sm:w-auto"
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className="py-2 px-4 rounded-full hover:bg-primary hover:text-white transition-all w-full sm:w-auto"
        >
          Cancelled
        </button>
        <select
          onChange={(e) => setFilter(`doctor_${e.target.value}`)}
          className="rounded-full px-5 w-full sm:w-auto"
        >
          <option value="">Select Doctor</option>
          {uniqueDoctors.map((doctorName, index) => (
            <option value={doctorName} key={index}>
              {doctorName}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {filteredAppointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between items-center max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] text-gray-500 py-3 px-6 border-b hover:bg-gray-300"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <img
                src={item.userData.userImage}
                alt="Patient"
                className="w-8 h-8 rounded-full object-cover"
              />
              <p>{item.userData.userName}</p>
            </div>

            <p className="max-sm:hidden">
              {CalculateAge(item.userData.userDoB)}
            </p>

            <p>{formatDate(item.date)}</p>

            <div className="flex items-center gap-2">
              <img
                src={item.docData.docImage}
                alt="Doctor"
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
              />
              <p>{item.docData.docName}</p>
            </div>

            <p>{currencySymbol + item.docData.docFee}</p>

            {item.cancelled ? (
              <p className="text-red-400 font-medium text-xs">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-400 font-medium text-xs">Completed</p>
            ) : (
              <img
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt="Cancel Appointment"
                onClick={() => {
                  setCurrentAppointment(item); // Set the current appointment
                  setOpen(true); // Open the modal
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal for Appointment Cancellation */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex items-center justify-center max-w-sm mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Confirm Appointment Cancellation
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-evenly gap-4">
              <button
                onClick={() => handleCancel(currentAppointment._id)} // Use currentAppointment's _id
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AllAppointments;
