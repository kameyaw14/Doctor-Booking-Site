import express from 'express'
import { AppointmentsDoctor, DoctorList, LoginDoctor } from '../controllers/DoctorController.js'
import AuthDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',DoctorList)
doctorRouter.post('/login',LoginDoctor)
doctorRouter.get('/appointments',AuthDoctor,AppointmentsDoctor)

export default doctorRouter