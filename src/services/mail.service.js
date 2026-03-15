import * as Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const client = new Brevo.TransactionalEmailsApi();
client.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

export async function sendMail({ to, subject, html }) {
  try {
    const email = new Brevo.SendSmtpEmail();
    email.to = [{ email: to }];
    email.subject = subject;
    email.htmlContent = html;
    email.sender = {
      name: "Cineverse",
      email: process.env.BREVO_SENDER,
    };

    const data = await client.sendTransacEmail(email);
    console.log("Email sent:", data.body.messageId);
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}