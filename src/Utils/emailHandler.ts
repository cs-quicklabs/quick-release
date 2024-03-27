import { transport } from "@/Utils/EmailService";

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: EmailParams) {
  transport.sendMail(params);
}

export async function sendVerificationEmail(email: string, verificationToken: string, firstName: string) {
  const verificationUrl = `${process.env.BASEURL}/?token=${verificationToken}`;
  const emailBody = `Hi ${firstName},<br/>
    Welcome to Quicklabs! We're thrilled to have you on board.<br/>
    Our mission is simple: to streamline change log management for all your software releases. With Quicklabs, you'll experience efficiency and clarity like never before.<br/>
    <br/>
    <a href="${verificationUrl}">Click to verify Account</a>,
    <br/>
    <br/>
    Best regards,<br/>
    Quick Release Team
    `;

  const emailParams: EmailParams = {
    to: email,
    from: process.env.EMAIL_FROM as string,
    subject: "Welcome to Quick Release",
    html: emailBody,
  };

  await sendEmail(emailParams);
}

export async function sendResetPasswordEmail(email: string, resetToken: string, firstName: string) {
  const resetUrl = `${process.env.BASEURL}/reset-password?token=${resetToken}`;
  const emailBody = `Hello ${firstName},<br/>
    Someone has requested a link to change your password. You can do this through the link below.<br/>
    <a href="${resetUrl}">Change my password</a>,<br/>
    If you didn't request this, please ignore this email.<br/>
    Your password won't change until you access the link above and create a new one.
    <br/>
    <br/>
    Best regards,<br/>
    Quick Release Team
    `;

  const emailParams: EmailParams = {
    to: email,
    from: process.env.EMAIL_FROM as string,
    subject: "Reset Password",
    html: emailBody,
  };

  await sendEmail(emailParams);
}