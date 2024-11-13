import DoctorModel from "../models/DoctorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppointmentModel from "../models/AppointmentsModel.js";
import UserModel from "../models/UserModel.js";

const ChangeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await DoctorModel.findById(docId);
    await DoctorModel.findByIdAndUpdate(docId, {
      docAvailabilty: !docData.docAvailabilty,
    });
    res.json({ success: true, message: "Availabilty changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for getting all doctors in client view
const DoctorList = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({}).select([
      "-docPassword",
      "-docEmail",
    ]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for doctor login
const LoginDoctor = async (req, res) => {
  try {
    const { docEmail, docPassword } = req.body;
    const doctor = await DoctorModel.findOne({ docEmail });

    if (!doctor) {
      return res.json({ success: false, message: "email does not exist" });
    }

    const isMatch = await bcrypt.compare(docPassword, doctor.docPassword);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get doctor appointments for doc panel
const AppointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await AppointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to mark appointment completed for doc panel
const AppointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await AppointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await AppointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to mark appointment cancelled for doc panel
const AppointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await AppointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await AppointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get patient profile by userId
const GetPatientProfileInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const patient = await AppointmentModel.findOne({ userId });

    if (!patient) {
      return res.json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, patient });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get dashboard data for doc panel
const DoctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await AppointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get doctor profile for doc panel
const DoctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;

    const profileData = await DoctorModel.findById(docId).select(
      "-docPassword"
    );

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to update doctor profile  for doc panel
const UpdateDoctorProfile = async (req, res) => {
  try {
    const { docId, docFee, docAddress, docAvailabilty } = req.body;

    await DoctorModel.findByIdAndUpdate(docId, {
      docFee,
      docAddress,
      docAvailabilty,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  ChangeAvailability,
  DoctorList,
  LoginDoctor,
  AppointmentsDoctor,
  AppointmentCancel,
  AppointmentComplete,
  GetPatientProfileInfo,
  DoctorDashboard,
  DoctorProfile,
  UpdateDoctorProfile,
};
