import express from 'express'
import { DoctorList } from '../controllers/DoctorController.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',DoctorList)

export default doctorRouter