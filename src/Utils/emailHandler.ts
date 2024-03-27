import { transport } from "@/Utils/EmailService";

type EmailParams = {
  to: string;
  from: string;
  subject: string;
  html: string;
};

export async function sendEmail(emailParams: EmailParams) {
  transport.sendMail(emailParams);
}

export async function sendVerificationEmail(email: string, verificationToken: string, firstName: string) {
  const verificationUrl = `${process.env.BASEURL}/?token=${verificationToken}`;
  const emailBody = `Hi ${firstName}
    Welcome to Quicklabs! We're thrilled to have you on board<br/>
    Our mission is simple: to streamline change log management for all your software releases. With Quicklabs, you'll experience efficiency and clarity like never before.
    <br/>
    
    
    <a href="${verificationUrl}">Click to verify Account</a>,<br/>
    <br/>
    Best regards,<br/>
    Quick Release Team<br/>
    `;
  
  const emailParams: EmailParams = {
    to: email,
    from: process.env.EMAIL_FROM as string,
    subject: "Welcome to Quick Release",
    html: emailBody,
  };

  await sendEmail(emailParams);
}