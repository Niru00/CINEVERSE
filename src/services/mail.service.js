import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SENDER,      // your email
    pass: process.env.BREVO_SMTP_KEY,    // SMTP key from Brevo
  },
});

export async function sendMail({ to, subject, html }) {
  try {
    const details = await transporter.sendMail({
      from: `"Cineverse" <${process.env.BREVO_SENDER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", details.messageId);
    return details;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}