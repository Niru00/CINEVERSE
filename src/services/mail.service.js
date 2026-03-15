import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
       user: process.env.EMAIL,          
    pass: process.env.EMAIL_PASSWORD,
  },
})

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
})

export async function sendMail({to,subject,html}) {
    const mailOptions ={
        from:process.env.EMAIL,
        to,
        subject,
        html
    }

    const details = await transporter.sendMail(mailOptions);
    console.log("email sent :"+ details);
}