import { db } from "@/lib/db";
import sgMail from "@sendgrid/mail";
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

  const emailBody =
    "Reset Password by clicking on following url:" +
    resetUrl +
    "     This link is valid for 24hours    ";

  const msg = {
    to: body.email,
    from: "akash@crownstack.com",
    subject: "Reset Password",
    text: emailBody,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  try {
    const sent = await sgMail.send(msg);

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
