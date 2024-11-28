import nodemailer from 'nodemailer'
import 'dotenv/config'


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

  const mailOptions = {
    from: {
        name : 'Booking Hub',
        address: process.env.EMAIL_USER,
    }, // sender address
    to: "kameyaw14@gmail.com", // list of receivers
    subject: "Hello ✔ man", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  }

  const sendMail = async (transporter,mailOptions) => {
    try {
        await transporter.sendMail(mailOptions)
        console.log('mail sent');
        
    } catch (error) {
        console.log(error);
        
    }
  }

  sendMail(transporter,mailOptions)