import * as nodemailer from "nodemailer";

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

// Fungsi sederhana untuk mengkonversi React props ke HTML
function createEmailHTML(props: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; margin-bottom: 20px;">Welcome, ${props.firstName}!</h1>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 10px 0;"><strong>Invoice No:</strong> ${props.invoiceNo}</p>
        <p style="margin: 10px 0;"><strong>Due Date:</strong> ${props.dueDate}</p>
        <p style="margin: 10px 0;"><strong>Total:</strong> ${props.total}</p>
      </div>

      <a href="${props.invoiceURL}"
         style="display: inline-block; background-color: #8c00ff; color: white; padding: 12px 24px;
                text-decoration: none; border-radius: 6px; font-weight: bold;">
        Download Invoice
      </a>

      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Thank you for your business!
      </p>
    </div>
  `;
}

export async function sendEmail(
  to: string,
  subject: string,
  templateProps: any
) {
  try {
    // Konversi props ke HTML string
    const htmlContent = createEmailHTML(templateProps.props);

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
