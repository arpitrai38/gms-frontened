const nodemailer = require('nodemailer');

// Create email transporter from environment variables
const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (user && pass) {
    const cleanPass = pass.replace(/\s+/g, ''); // Handles 16-character Google App Passwords with or without spaces

    // If it's a Gmail address or default smtp
    if (user.endsWith('@gmail.com') || !process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.gmail.com') {
      return {
        transporter: nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass: cleanPass }
        }),
        sender: user
      };
    }

    return {
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass: cleanPass }
      }),
      sender: user
    };
  }
  return null;
};

/**
 * Sends a clean, modern HTML email with the 6-digit OTP code.
 */
const sendOtpEmail = async (toEmail, otpCode, recipientName = 'User') => {
  const subject = `Your Password Reset OTP: ${otpCode} - Gym Management`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; background: linear-gradient(135deg, #06b6d4, #14b8a6); border-radius: 12px; color: white; font-size: 24px;">🏋️</div>
        <h2 style="color: #0f172a; margin: 12px 0 4px 0; font-size: 20px; font-weight: 800;">GYM MANAGEMENT</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Password Reset Verification</p>
      </div>

      <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
        <p style="color: #334155; font-size: 14px; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">You requested to reset your password. Use the following 6-digit OTP code to complete your verification:</p>
        
        <div style="margin: 24px 0; padding: 16px; background-color: #ecfeff; border: 2px dashed #06b6d4; border-radius: 12px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0891b2;">
          ${otpCode}
        </div>

        <p style="color: #94a3b8; font-size: 12px; margin: 0;">⏱️ This OTP code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>

      <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 20px;">
        If you did not request this password reset, please ignore this email or contact your gym administrator.
      </p>
    </div>
  `;

  const transportConfig = createTransporter();

  // Always log OTP to server console for instant local development/testing
  console.log(`\n=================================================`);
  console.log(`🔑 [PASSWORD RESET OTP] Recipient: ${toEmail}`);
  console.log(`🔢 [OTP CODE]: ${otpCode}`);
  console.log(`⏱️ [EXPIRES]: 10 minutes from now`);
  if (!transportConfig) {
    console.log(`ℹ️ [NOTE]: No EMAIL_USER/EMAIL_PASS in backend/.env. Real email not sent.`);
    console.log(`👉 To deliver real emails to Gmail: add EMAIL_USER=your_email@gmail.com and EMAIL_PASS=your_app_password to backend/.env`);
  }
  console.log(`=================================================\n`);

  if (!transportConfig) {
    return {
      sent: false,
      reason: 'No email credentials in .env. OTP provided in response and console.'
    };
  }

  try {
    const info = await transportConfig.transporter.sendMail({
      from: `"Gym Management System" <${transportConfig.sender}>`,
      to: toEmail,
      subject,
      html: htmlContent
    });
    console.log(`📧 Real OTP email dispatched successfully: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`⚠️ Could not send email via SMTP: ${err.message}. OTP is logged in console.`);
    return { sent: false, error: err.message };
  }
};

module.exports = {
  sendOtpEmail
};
