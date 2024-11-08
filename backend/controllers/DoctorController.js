import DoctorModel from "../models/DoctorModel.js";


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


export {ChangeAvailability, DoctorList}