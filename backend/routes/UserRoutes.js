import express from "express";
import {
  AppointmentsList,
  BookAppointment,
  CancelAppointmentApi,
  DeleteAppointmentApi,
  GetUserProfileInfo,
  LoginUser,
  RegisterUser,
  UpdateUserProfile,
} from "../controllers/UserController.js";
import AuthUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.get("/get-profile", AuthUser, GetUserProfileInfo);
userRouter.post(
  "/update-profile",
  upload.single("userImage"),
  AuthUser,
  UpdateUserProfile
);
userRouter.post("/book-appointment", AuthUser, BookAppointment);
userRouter.get("/appointments-list", AuthUser, AppointmentsList);
userRouter.post("/cancel-appointment", AuthUser, CancelAppointmentApi);
userRouter.delete("/delete-appointment",AuthUser,DeleteAppointmentApi)





export default userRouter;
