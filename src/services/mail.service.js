import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail({ to, subject, html }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Cineverse <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email error:", error);
      throw error;
    }

    console.log("Email sent:", data.id);
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}