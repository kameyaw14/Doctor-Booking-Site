import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import DoctorModel from "../models/DoctorModel.js";
import jwt from "jsonwebtoken";
import AppointmentModel from "../models/AppointmentsModel.js";
import UserModel from "../models/UserModel.js";

// API for adding a new doctor
const AddDoctor = async (req, res) => {
  try {
    const {
      docName,
      docEmail,
      docPassword,
      docSpeciality,
      docDegree,
      docExperience,
      docAbout,
      // docAvailabilty,
      docFee,
      docAddress,
    } = req.body;

    const imageFile = req.file;

    const missingFields = [];

    // Check each field and push specific error messages to the array if missing
    if (!docName) missingFields.push("Doctor name is required");
    if (!docEmail) missingFields.push("Doctor email is required");
    if (!docPassword) missingFields.push("Doctor password is required");
    if (!docSpeciality) missingFields.push("Doctor speciality is required");
    if (!docDegree) missingFields.push("Doctor degree is required");
    if (!docExperience) missingFields.push("Doctor experience is required");
    if (!docAbout) missingFields.push("Doctor about information is required");
    // if (!docAvailabilty) missingFields.push("Doctor availability is required");
    if (!docFee) missingFields.push("Doctor fee is required");
    if (!docAddress) missingFields.push("Doctor address is required");
    if (!imageFile) missingFields.push("Doctor image file is required");

    // If there are missing fields, return an error response
    if (missingFields.length > 0) {
      return res.json({
        success: false,
        message: `Missing fields ${missingFields}`,
        details: missingFields,
      });
    }

    // Proceed with the rest of the function if all fields are present

    // Validate email format
    if (!validator.isEmail(docEmail)) {
      return res.json({ success: false, message: "Invalid email" });
    }

    // Validate password length
    if (docPassword.length < 8) {
      return res.json({ success: false, message: "Password too weak" });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(docPassword, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageURL = imageUpload.secure_url;

    // Prepare doctor data for saving
    const doctorData = {
      docName,
      docEmail,
      docPassword: encryptedPassword,
      docImage: imageURL,
      docSpeciality,
      docDegree,
      docExperience,
      docAbout,
      // docAvailabilty,
      docFee,
      docAddress: JSON.parse(docAddress),
      createdAt: Date.now(),
    };

    const newDoctor = new DoctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin Login
const LoginAdmin = async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;

    if (
      adminEmail === process.env.ADMIN_EMAIL &&
      adminPassword === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        adminEmail + adminPassword,
        process.env.JWT_SECRET
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "inavalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for getting all doctors in admin panel
const AllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({}).select("-docPassword");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const AppointmentsAdmin = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to cancel appointment
const AppointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await AppointmentModel.findById(appointmentId);

    // setting cancelled property of appointmodel to true
    await AppointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //releasing docSlot
    const { docId, slotDate, slotTime } = appointmentData;

    const docData = await DoctorModel.findById(docId);

    let slotsBooked = docData.slotsBooked;

    slotsBooked[slotDate] = slotsBooked[slotDate].filter((e) => e != slotTime);

    await DoctorModel.findByIdAndUpdate(docId, { slotsBooked });

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get dashboard data

const AdminDAshboard = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({});
    const users = await UserModel.find({});
    const appointments = await AppointmentModel.find({});

    const dashboardData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  AddDoctor,
  LoginAdmin,
  AllDoctors,
  AppointmentsAdmin,
  AppointmentCancel,
  AdminDAshboard,
};
