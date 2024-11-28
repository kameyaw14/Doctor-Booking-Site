import DoctorModel from "../models/DoctorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppointmentModel from "../models/AppointmentsModel.js";
import UserModel from "../models/UserModel.js";
import nodemailer from "nodemailer";
import BookedAppointmentModel from "../models/BookedAppointments.js";

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

//api to get booked doctor appointments for doc panel
const BookedAppointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const bookedappointments = await BookedAppointmentModel.find({ docId });

    res.json({ success: true, bookedappointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to mark appointment completed for doc panel
const AppointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await BookedAppointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await BookedAppointmentModel.findByIdAndUpdate(appointmentId, {
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

    const appointmentData = await BookedAppointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await BookedAppointmentModel.findByIdAndUpdate(appointmentId, {
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

// api to get appointment data
const GetAppointmentData = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await AppointmentModel.findOne({ _id: appointmentId });

    if (!appointment) {
      return res.json({ success: false, message: "appointment not found" });
    }

    res.json({ success: true, appointment });
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

const CompleteAppointmentConfirmation = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Send email to the patient for confirmation
    const patientEmail = appointment.userData.email; // Assuming userData has email

    // Create a confirmation link (you can use JWT or any other method for validation)
    const confirmationLink = `https://doctor-booking-site-4-admin.onrender.com/confirm-appointment/${appointmentId}`;

    // Set up Nodemailer transporter

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kameyaw14@gmail.com',
        pass: 'TheyAreMine7755'
      }
    });
    
    var mailOptions = {
      from: 'kameyaw14@gmail.com',
      to: 'kojoameyaw519@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ success: true, message: "Confirmation email sent to patient" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const MarkAppointmentAsCompleted = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (!appointment.isConfirmedByPatient) {
      return res.json({ success: false, message: "Patient has not confirmed yet" });
    }

    // Mark appointment as completed
    appointment.isCompleted = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment marked as completed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const SetAppointmentDateAndTime = async (req, res) => {
  try {
    const { slotDate, slotTime, docId, userId, userData, docData, amount } = req.body;

    // Ensure all required fields are provided
    const missingFields = [];
    if (!slotDate) missingFields.push("Slot date");
    if (!slotTime) missingFields.push("Slot time");
    if (!docId) missingFields.push("Doctor ID");
    if (!userId) missingFields.push("User ID");
    if (!userData) missingFields.push("User data");
    if (!amount) missingFields.push("Amount");
    
    if (missingFields.length > 0) {
      return res.json({ success: false, message: `${missingFields.join(", ")} ${missingFields.length > 1 ? 'are' : 'is'} required.` });
    }

    // Check for doctor availability
    const docDataFromDb = await DoctorModel.findById(docId).select("-password");
    let slotsBooked = docDataFromDb.slotsBooked;

    if (slotsBooked[slotDate]) {
      if (slotsBooked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot unavailable" });
      } else {
        slotsBooked[slotDate].push(slotTime);
      }
    } else {
      slotsBooked[slotDate] = [];
      slotsBooked[slotDate].push(slotTime);
    }

    // Save new appointment data
    const appointmentsData = {
      userId,
      docId,
      slotDate,
      slotTime,
      userData,
      docData,
      amount,
      date: Date.now(), // Use current timestamp for date
    };

    const newAppointment = new BookedAppointmentModel(appointmentsData);
    await newAppointment.save();

    // Save updated slots in the doctor's record
    await DoctorModel.findByIdAndUpdate(docId, { slotsBooked });

    // Email Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose Email
    const mailOptions = {
      from: {
        name: 'Doctor Booking Site',
        address: process.env.EMAIL_USER,
      },
      to: userData.email, // Assuming userData includes the patient's email
      subject: 'Appointment Confirmation',
      html: `
        <h3>Appointment Confirmation</h3>
        <p>Hello ${userData.name},</p>
        <p>Your appointment with Dr. ${docData.name} has been successfully booked.</p>
        <p><strong>Date:</strong> ${slotDate}</p>
        <p><strong>Time:</strong> ${slotTime}</p>
        <p>We look forward to seeing you!</p>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to patient.');

    res.json({ success: true, message: "Appointment booked successfully and email sent" });
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
  CompleteAppointmentConfirmation,
  MarkAppointmentAsCompleted,
  SetAppointmentDateAndTime,
  GetAppointmentData
  ,BookedAppointmentsDoctor,
};
