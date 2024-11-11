import DoctorModel from "../models/DoctorModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import AppointmentModel from "../models/AppointmentsModel.js";


const ChangeAvailability = async (req,res) =>{
    try {
       
        const {docId} = req.body

        const docData = await DoctorModel.findById(docId)
        await DoctorModel.findByIdAndUpdate(docId,{docAvailabilty: !docData.docAvailabilty})
        res.json({success:true,message:'Availabilty changed'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


//api for getting all doctors in client view
const DoctorList = async (req,res)=>{
    try {
        
        const doctors = await DoctorModel.find({}).select(['-docPassword','-docEmail'])
        res.json({success:true,doctors})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//api for doctor login
const LoginDoctor = async (req,res)=>{
    try {
        
        const { docEmail,docPassword  } = req.body
        const doctor = await DoctorModel.findOne({docEmail})

        if (!doctor) {
            return res.json({success:false, message:'email does not exist'})
        }

        const isMatch = await bcrypt.compare(docPassword, doctor.docPassword)

        if (isMatch) {
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        } else {
            res.json({success:false, message:'Invalid credentials'})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//api to get doctor appointments for doc panel
const AppointmentsDoctor = async (req,res)=>{
    try {
       const {docId} = req.body 
       const appointments = await AppointmentModel.find({docId})
       
       res.json({success: true, appointments})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


export {ChangeAvailability, DoctorList, LoginDoctor,AppointmentsDoctor}