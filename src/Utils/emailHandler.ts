import { transport } from "@/Utils/EmailService";

type EmailParams = {
  to: string;
  from: string;
  subject: string;
  html: string;
};

function sendEmail(params: EmailParams): Promise<void> {
  return new Promise((resolve, reject) => {
    transport.sendMail(params, (error: Error | null) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

export async function sendVerificationEmail(email: string, verificationToken: string, firstName: string): Promise<void> {
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
    subject: "Quick Release: Welcome to Quick Release",
    html: emailBody,
  };

  await sendEmail(emailParams);
}

export async function sendResetPasswordEmail(email: string, resetToken: string, firstName: string): Promise<void> {
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
    subject: "Quick Release: Reset Password",
    html: emailBody,
  };

  await sendEmail(emailParams);
}

export async function sendPasswordUpdatedEmail(email: string, firstName: string): Promise<void> {
  const emailBody = `Hi ${firstName},<br/>
    Your password has been updated successfully.<br/>,
    <br/>
    <br/>
    Best regards,<br/>
    Quick Release Team
    `;

  const emailParams: EmailParams = {
    to: email,
    from: process.env.EMAIL_FROM as string,
    subject: "Quick Release: Password Updated",
    html: emailBody,
  };

  await sendEmail(emailParams);
}
