import express from "express";
import {
  AppointmentCancel,
  AppointmentComplete,
  AppointmentsDoctor,
  BookedAppointmentsDoctor,
  CompleteAppointmentConfirmation,
  DoctorDashboard,
  DoctorList,
  DoctorProfile,
  GetAppointmentData,
  GetPatientProfileInfo,
  LoginDoctor,
  MarkAppointmentAsCompleted,
  SetAppointmentDateAndTime,
  UpdateDoctorProfile,
} from "../controllers/DoctorController.js";
import AuthDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", DoctorList);
doctorRouter.post("/login", LoginDoctor);
doctorRouter.get("/appointments", AuthDoctor, AppointmentsDoctor);
doctorRouter.get("/booked-appointments", AuthDoctor, BookedAppointmentsDoctor);
doctorRouter.post("/complete-appointment", AuthDoctor, AppointmentComplete);
doctorRouter.post("/cancel-appointment", AuthDoctor, AppointmentCancel);
doctorRouter.get("/patient/:userId", AuthDoctor, GetPatientProfileInfo);
doctorRouter.get("/appointment/:appointmentId", AuthDoctor, GetAppointmentData);
doctorRouter.get("/doctor-dashboard", AuthDoctor, DoctorDashboard);
doctorRouter.get("/doctor-profile", AuthDoctor, DoctorProfile);
doctorRouter.post("/doctor-update-profile", AuthDoctor, UpdateDoctorProfile);
doctorRouter.post('/complete-appointmentConfirm',AuthDoctor,CompleteAppointmentConfirmation)
doctorRouter.post('/mark-completed',AuthDoctor,MarkAppointmentAsCompleted)
doctorRouter.post('/set-appointment',AuthDoctor,SetAppointmentDateAndTime)





export default doctorRouter;
