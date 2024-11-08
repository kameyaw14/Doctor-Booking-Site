import express from "express"
import { AddDoctor, AdminDAshboard, AllDoctors, AppointmentCancel, AppointmentsAdmin, LoginAdmin } from "../controllers/AdminController.js"
import upload from "../middlewares/multer.js"
import AuthAdmin from "../middlewares/authAdmin.js"
import { ChangeAvailability } from "../controllers/DoctorController.js"


const AdminRouter = express.Router()

AdminRouter.post('/add-doctor',AuthAdmin,upload.single('docImage'),AddDoctor)
AdminRouter.post('/login',LoginAdmin)
AdminRouter.post('/all-doctors',AuthAdmin,AllDoctors)
AdminRouter.post('/change-availability',AuthAdmin,ChangeAvailability)
AdminRouter.get('/appointments',AuthAdmin,AppointmentsAdmin)
AdminRouter.post('/cancel-appointment',AuthAdmin,AppointmentCancel)
AdminRouter.get('/admin-dashboard',AuthAdmin,AdminDAshboard)


export default AdminRouter