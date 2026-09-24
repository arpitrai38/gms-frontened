# Gym Management System - Render Deployment & OTP Verification Guide

This guide explains how the universal OTP email system works across all gym owners and users, and how to verify it on Render.

---

## 1. How OTP Email Delivery Works (Sender vs. Recipient)

In web development, there is a fundamental difference between the **Mail Gateway (Sender)** and the **Recipient**:

| Role | Variable / Property | Address | Purpose |
| :--- | :--- | :--- | :--- |
| **System Mail Gateway (Sender)** | `EMAIL_USER` / `from` | `sadhanamarendra12@gmail.com` | Acts as the platform's automated delivery server (like `noreply@company.com`). |
| **Dynamic Recipient** | `to` | **The user's own email** (e.g. `gymowner1@gmail.com`, `client@gmail.com`) | The exact email address entered by the gym owner or user requesting the OTP. |

### Code Implementation in `backend/services/emailService.js`:
```javascript
const info = await transportConfig.transporter.sendMail({
  from: `"Gym Management System" <${transportConfig.sender}>`, // System gateway (Sender)
  to: toEmail,                                                 // Dynamic Recipient (User's Email)
  subject: `Your Password Reset OTP: ${otpCode} - Gym Management`,
  html: htmlContent
});
```

---

## 2. Real-World Multi-User Scenario

### Case 1: Gym Owner A opens their gym
1. Gym Owner A registers with `gymowner_a@gmail.com` (via Google Login or manual registration).
2. They click **Forgot Password** or **Change Password via OTP** in their Profile.
3. The server generates a 6-digit OTP and sends the email **directly to `gymowner_a@gmail.com`**.
4. The OTP email lands in **Gym Owner A's personal Gmail inbox**.
5. It does **NOT** go to the sender email (`sadhanamarendra12@gmail.com`).

### Case 2: Gym Owner B registers another gym
1. Gym Owner B registers with `gymowner_b@gmail.com`.
2. They request a password reset OTP.
3. The server sends the OTP **directly to `gymowner_b@gmail.com`**.
4. Gym Owner B receives their own unique OTP in their inbox.

### Case 3: Trainers & Members
1. Any trainer or gym member registered with their Google account can request an OTP.
2. The OTP is delivered **only to that specific trainer's or member's email address**.

---

## 3. Render Dashboard Environment Variables

For live cloud delivery on Render, make sure these 4 Environment Variables are set in your Render Web Service dashboard (**Environment** tab):

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://sadhanamarendra12_db_user:ArpitRai_12345@cluster0.b96elmj.mongodb.net/gym_management?retryWrites=true&w=majority&appName=Cluster0` | Production MongoDB Atlas connection string |
| `NODE_ENV` | `production` | Production environment mode |
| `EMAIL_USER` | `sadhanamarendra12@gmail.com` | SMTP Sender account |
| `EMAIL_PASS` | `ooer pznc ydfz iwvr` | 16-character Google App Password |

> **Note:** Port 465 SSL is automatically utilized with connection timeouts to ensure instant, reliable delivery on Render's cloud infrastructure.

---

## 4. How to Test on Your Live Render URL

1. Open your live Render app URL in a browser.
2. On the login screen, click **"Forgot Password?"**.
3. Select **Admin** (or Trainer/Member) and enter **any Google email address** (e.g. your secondary Gmail or test email).
4. Click **"Send OTP"**.
5. Open that specific Google email inbox:
   - You will see an email from **"Gym Management System"**.
   - Subject: `Your Password Reset OTP: [6-digit code] - Gym Management`.
6. Enter the 6-digit OTP and your new password to verify and log in.
