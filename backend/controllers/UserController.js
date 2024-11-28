import validator from "validator";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import DoctorModel from "../models/DoctorModel.js";
import AppointmentModel from "../models/AppointmentsModel.js";
import razorpay from 'razorpay'


//api to register user
const RegisterUser = async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  //checking if all fields are filled
  const missingFields = [];

  if (!userName) missingFields.push("Enter a username");
  if (!userEmail) missingFields.push("Enter an email");
  if (!userPassword) missingFields.push("Enter a password");

  if (missingFields.length > 0) {
    return res.json({
      success: false,
      message: `Missing fields: ${missingFields}`,
    });
  }

  //checking if the email entered is in email format
  try {
    if (!validator.isEmail(userEmail)) {
      return res.json({ success: false, message: `Enter a valid email ` });
    }

    //checking if the password is strong
    if (userPassword.length < 8) {
      return res.json({
        success: false,
        message: `Password must be more than 8 characters `,
      });
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    //saving user info to DB pt 1
    const userData = {
      userName,
      userPassword: hashedPassword,
      userEmail,
    };

    //saving user info to DB pt 2
    const newUser = new UserModel(userData);
    const user = await newUser.save();

    //generating a token for user pt 1
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    //generating a token for user pt 2
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    //look for the email from the usermodel
    const user = await UserModel.findOne({ userEmail });

    //checking the user exist or not
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    //validating the password1
    const isMatch = await bcrypt.compare(userPassword, user.userPassword);

    //validating the password2
    if (isMatch) {
      //generate a token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get user profile data
const GetUserProfileInfo = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await UserModel.findById(userId).select("-userPassword");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to update user profile data
const UpdateUserProfile = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userAddress,
      userDoB,
      userGender,
      userPhone,
    } = req.body;
    const imageFile = req.file;

    let missingFields = [];

    if (!userName) {
      missingFields.push(" name");
    }
    // if (!userAddress) {
    //   missingFields.push(" address");
    // }
    if (!userDoB) {
      missingFields.push(" date of birth");
    }
    if (!userGender) {
      missingFields.push(" gender");
    }
    if (!userPhone) {
      missingFields.push(" phone number");
    }

    if (missingFields.length > 0) {
      return res.json({
        success: false,
        message: `Missing fields: ${missingFields}`,
        details: missingFields,
      });
    }

    await UserModel.findByIdAndUpdate(userId, {
      userName,
      userPhone,
      userAddress: JSON.parse(userAddress),
      userDoB,
      userGender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await UserModel.findByIdAndUpdate(userId, { userImage: imageURL });
    }

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to bok appointment
const BookAppointment = async (req, res) => {
  try {
    const { userId, docId, symptoms } = req.body;

    const docData = await DoctorModel.findById(docId).select("-password");

    //checking for doctor availabilty
    if (!docData.docAvailabilty) {
      return res.json({
        success: false,
        message: "Doctor is not availbale at the moment",
      });
    }

    //checking for slot availabilty

    // let slotsBooked = docData.slotsBooked;

    // if (slotsBooked[slotDate]) {
    //   if (slotsBooked[slotDate].includes(slotTime)) {
    //     return res.json({ success: false, message: "Slot unavailable" });
    //   } else {
    //     slotsBooked[slotDate].push(slotTime);
    //   }
    // } else {
    //   slotsBooked[slotDate] = [];
    //   slotsBooked[slotDate].push(slotTime);
    // }

    const userData = await UserModel.findById(userId).select("-password");

    // delete docData.slotsBooked;

    //saving to DB pt1
    const appointmentsData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.docFee,
      symptoms,
      date: Date.now(),
    };
    //saving to DB pt2
    const newAppointment = new AppointmentModel(appointmentsData);
    await newAppointment.save();

    //save new slots data in docData
    // await DoctorModel.findByIdAndUpdate(docId, { slotsBooked });

    // Convert the date (timestamp) to a readable format
    const formattedAppointment = {
      ...appointmentsData,
      date: new Date(appointmentsData.date).toLocaleString(),  // Convert timestamp to readable date
    };

    res.json({
      success: true,
      message: "Appointment sent to doctor",
      appointment: formattedAppointment,  // Send formatted appointment data
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get user appointmnets
const AppointmentsList = async (req, res) => {
  try {
    const { userId } = req.body;

    //where to store all appointments
    const appointments = await AppointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//cancel appointment api
const CancelAppointmentApi = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    // Fetch appointment data
    const appointmentData = await AppointmentModel.findById(appointmentId);

    // Verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorised action" });
    }

    // Set 'cancelled' property to true and clear the symptoms
    await AppointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      symptoms: "",  // Or you could use null if you prefer
    });

    res.json({ success: true, message: "Appointment cancelled " });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const DeleteAppointmentApi = async (req,res)=>{
  try {
    
    const {userId,appointmentId} = req.body

    const appointmentData = await AppointmentModel.findById(appointmentId)

    //verify action
    if (appointmentData.userId !== userId) {
      return res.json({success:false,message:'Unauthorized action'})
    }

    // deleting appointment
    await AppointmentModel.findByIdAndDelete(appointmentId)

    //releasing docSlot
    const {docId,slotDate,slotTime} = appointmentData

    const docData = await DoctorModel.findById(docId)

    let slotsBooked = docData.slotsBooked
    if (slotsBooked[slotDate]) {
      slotsBooked[slotDate] = slotsBooked[slotDate].filter((e) =>e !== slotTime)
    }

     // Update the doctor's available slots in the database
     await DoctorModel.findByIdAndUpdate(docId, { slotsBooked });

     res.json({ success: true, message: "Appointment deleted successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// api to make online payments using razorpay








export {
  RegisterUser,
  LoginUser,
  GetUserProfileInfo,
  UpdateUserProfile,
  BookAppointment,
  AppointmentsList,
  CancelAppointmentApi,
  DeleteAppointmentApi,
};