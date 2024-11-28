import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: false },
    slotTime: { type: String, required: false },
    userData: { type: Object, required: true },
    docData: { type: Object, required: false },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    symptoms: {type: String, required: false}
  });
  

const AppointmentModel = mongoose.models.appointment || mongoose.model('appointment',AppointmentSchema)

export default AppointmentModel