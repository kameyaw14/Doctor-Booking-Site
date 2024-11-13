import express from "express";
import {
  AppointmentCancel,
  AppointmentComplete,
  AppointmentsDoctor,
  DoctorDashboard,
  DoctorList,
  DoctorProfile,
  GetPatientProfileInfo,
  LoginDoctor,
  UpdateDoctorProfile,
} from "../controllers/DoctorController.js";
import AuthDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", DoctorList);
doctorRouter.post("/login", LoginDoctor);
doctorRouter.get("/appointments", AuthDoctor, AppointmentsDoctor);
doctorRouter.post("/complete-appointment", AuthDoctor, AppointmentComplete);
doctorRouter.post("/cancel-appointment", AuthDoctor, AppointmentCancel);
doctorRouter.get("/patient/:userId", AuthDoctor, GetPatientProfileInfo);
doctorRouter.get("/doctor-dashboard", AuthDoctor, DoctorDashboard);
doctorRouter.get("/doctor-profile", AuthDoctor, DoctorProfile);
doctorRouter.post("/doctor-update-profile", AuthDoctor, UpdateDoctorProfile);

export default doctorRouter;
