import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "../components/Modal";

const MyAppointments1 = () => {
  const { backendURL, token, GetDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null); // State to store current appointment

  const GetUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/user/appointments-list",
        { headers: { token } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const HandleCancelAppointments = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        GetUserAppointments();
        GetDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const HandleDeleteAppointment = async (appointmentId, userId) => {
    try {
      const { data } = await axios.delete(
        backendURL + "/api/user/delete-appointment",
        {
          headers: { token },
          data: { userId, appointmentId },
        }
      );

      if (data.success) {
        toast.success(data.message);
        GetUserAppointments();
        GetDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // This function will handle opening the cancel modal and setting the current appointment
  const openCancelAppointmentModal = (appointment) => {
    setCurrentAppointment(appointment);
    setOpenCancelModal(true);
  };

  // This function will handle opening the delete modal and setting the current appointment
  const openDeleteAppointmentModal = (appointment) => {
    setCurrentAppointment(appointment);
    setOpenDeleteModal(true);
  };

  const handleCancel = () => {
    if (currentAppointment) {
      HandleCancelAppointments(currentAppointment._id); // Call cancel appointment function
    }
    setOpenCancelModal(false); // Close cancel modal
  };

  const handleDelete = () => {
    if (currentAppointment) {
      HandleDeleteAppointment(
        currentAppointment._id,
        currentAppointment.userId
      ); // Call delete appointment function
    }
    setOpenDeleteModal(false); // Close delete modal
  };

  useEffect(() => {
    if (token) {
      GetUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      {appointments.length > 0 ? (
        <div>
          {appointments.map((item, id) => {
            const formattedDate = new Date(item.date).toLocaleString();

            return (
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 sm:gap-6 py-2 border-b"
                key={id}
              >
                <div>
                  {item.docData ? (
                    <img
                      className="w-32 bg-indigo-50"
                      src={item.docData.docImage || "default-image-url"}
                      alt="Doctor"
                    />
                  ) : (
                    <div>No image available</div>
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="text-neutral-800 font-semibold">
                    {item.docData
                      ? item.docData.docName
                      : "Doctor Not Available"}
                  </p>
                  <p>
                    {item.docData
                      ? item.docData.docSpeciality
                      : "Specialty Not Available"}
                  </p>
                  <p className="text-zinc-700 font-medium mt-1">Address:</p>
                  <p className="text-xs">
                    {item.docData?.docAddress?.line1 || "Address Not Available"}
                  </p>
                  <p className="text-xs">
                    {item.docData?.docAddress?.line2 || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    Booked on: {formattedDate}
                  </p>
                </div>
                <div></div>
                <div className="flex justify-end gap-5">
                  {!item.cancelled && !item.isCompleted ? (
                    <>
                      <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                        Pay Online
                      </button>
                      <button
                        onClick={() => openCancelAppointmentModal(item)}
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  ) : item.cancelled && !item.isCompleted ? (
                    <>
                      <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                        Appointment Cancelled
                      </button>
                      <button
                        onClick={() => openDeleteAppointmentModal(item)}
                        className="sm:min-w-48 py-2 border border-red-500 bg-red-500 rounded text-white"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                      Appointment Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>You have no appointments booked</p>
      )}

      {/* Cancel Appointment Modal */}
      <Modal open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <div className="flex items-center justify-center max-w-sm mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Cancellation</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-evenly gap-4">
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenCancelModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Appointment Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className="flex items-center justify-center max-w-sm mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this appointment?
            </p>
            <div className="flex justify-evenly gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenDeleteModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
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

export default MyAppointments1;
