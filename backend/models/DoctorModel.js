import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    docName: { type: String, required: true },
    docEmail: { type: String, required: true, unique: true },
    docPassword: { type: String, required: true },
    docImage: { type: String, required: true },
    docSpeciality: { type: String, required: true },
    docDegree: { type: String, required: true },
    docExperience: { type: String, required: true },
    docAbout: { type: String, required: true },
    docAvailabilty: { type: Boolean, default: true },
    docFee: { type: Number, required: true },
    docAddress: { type: Object, required: true },
    createdAt: { type: Number, required: true },
    slotsBooked: { type: Object, default: {} },
  },
  { minimize: false }
);

const DoctorModel =
  mongoose.models.doctor || mongoose.model("doctor", DoctorSchema);

export default DoctorModel;