import { transport } from "@/Utils/EmailService";
import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const existingUser = await db.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (!existingUser) {
    return new NextResponse("Email doesn't exists", { status: 400 });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; //24hours
  const passwordResetExpires = (Date.now() + oneDayInMilliseconds).toString();

  existingUser.resetToken = passwordResetToken;
  existingUser.resetTokenExpiry = passwordResetExpires;
  const resetUrl = `${process.env.BASEURL}/reset-password/?token=${resetToken}`;

  const emailBody = `Hello ${existingUser.firstName},
Someone has requested a link to change your password. You can do this through the link below.
<a href="${resetUrl}">Change my password</a>,
If you didn't request this, please ignore this email.
Your password won't change until you access the link above and create a new one.`;

  const msg = {
    to: body.email,
    from: process.env.EMAIL_FROM,
    subject: "Reset Password",
    html: emailBody,
  };

  try {
    const sent = await transport.sendMail(msg);

    await db.user.update({
      where: {
        email: body.email,
      },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: passwordResetExpires,
      },
    });

    return new NextResponse("Reset Password email is sent", { status: 200 });
  } catch (err) {
    console.error(err);

    await db.user.update({
      where: {
        email: body.email,
      },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return new NextResponse("Failed sending email. Try again", { status: 400 });
  }
}
