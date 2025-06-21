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

// Professional email template yang matching dengan PDF design
function createEmailHTML(props: any) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${props.invoiceNo}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

        <!-- Header with accent line -->
        <div style="height: 4px; background-color: #2563eb;"></div>

        <!-- Main content -->
        <div style="padding: 40px 30px;">

          <!-- Header section -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #2563eb; font-size: 28px; font-weight: bold; margin: 0 0 10px 0;">
              INVOICE
            </h1>
            <p style="color: #64748b; font-size: 16px; margin: 0;">
              Hello ${props.firstName}, your invoice is ready!
            </p>
          </div>

          <!-- Invoice details card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #1e293b; font-size: 18px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">
              Invoice Details
            </h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #64748b; font-size: 14px; font-weight: 500;">Invoice No:</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                  <span style="color: #1e293b; font-size: 14px; font-weight: bold;">${props.invoiceNo}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #64748b; font-size: 14px; font-weight: 500;">Due Date:</span>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                  <span style="color: #1e293b; font-size: 14px; font-weight: bold;">${props.dueDate}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0;">
                  <span style="color: #64748b; font-size: 14px; font-weight: 500;">Total Amount:</span>
                </td>
                <td style="padding: 12px 0; text-align: right;">
                  <span style="color: #2563eb; font-size: 18px; font-weight: bold;">${props.total}</span>
                </td>
              </tr>
            </table>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 40px;">
            <a href="${props.invoiceURL}"
               style="display: inline-block; background-color: #2563eb; color: #ffffff;
                      padding: 16px 32px; text-decoration: none; border-radius: 8px;
                      font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              📄 Download Invoice PDF
            </a>
          </div>

          <!-- Additional info -->
          <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <div style="display: flex; align-items: center;">
              <span style="color: #92400e; font-size: 20px; margin-right: 10px;">⚠️</span>
              <div>
                <p style="color: #92400e; font-size: 14px; font-weight: bold; margin: 0 0 5px 0;">
                  Payment Reminder
                </p>
                <p style="color: #92400e; font-size: 13px; margin: 0;">
                  Please ensure payment is made by the due date to avoid any late fees.
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
              Thank you for your business! 🙏
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>

        </div>
      </div>
    </body>
    </html>
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
      text: `
Invoice ${templateProps.props.invoiceNo} - ${templateProps.props.total}

Hello ${templateProps.props.firstName},

Your invoice is ready for download:
- Invoice No: ${templateProps.props.invoiceNo}
- Due Date: ${templateProps.props.dueDate}
- Total Amount: ${templateProps.props.total}

Download your invoice: ${templateProps.props.invoiceURL}

Thank you for your business!
      `.trim(),
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
