import * as nodemailer from "nodemailer";
import { renderToString } from "react-dom/server";

// Konfigurasi nodemailer untuk invoice emails (optimal untuk Gmail)
const emailConfig = {
  host: process.env.EMAIL_SERVER_HOST!,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "465"),
  secure: true, // Selalu gunakan SSL/TLS untuk port 465
  auth: {
    user: process.env.EMAIL_SERVER_USER!,
    pass: process.env.EMAIL_SERVER_PASSWORD!,
  },
  tls: {
    // Optimal untuk Gmail/Google Workspace
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
  // Pool connections untuk performa yang lebih baik
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  // Rate limiting untuk menghindari Gmail limits
  rateLimit: 5, // max 5 emails per second
};

// Buat transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verifikasi koneksi saat startup (optional)
transporter.verify((error) => {
  if (error) {
    console.error("Email transporter error:", error);
  } else {
    console.log("Email server ready");
  }
});

export async function sendEmail(to: string, subject: string, reactHTML: any) {
  try {
    // Konversi React component ke HTML string
    const htmlContent = renderToString(reactHTML);

    const mailOptions = {
      from: process.env.EMAIL_FROM!,
      to: to,
      subject: subject,
      html: htmlContent,
      text: `Invoice baru telah dibuat. Silakan buka email untuk melihat detail lengkap.`,
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
      response: result.response,
    };
  } catch (error: any) {
    console.error("Email sending error:", error);

    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
}
