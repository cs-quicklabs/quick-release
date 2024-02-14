import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

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

  const passwordResetExpires = (Date.now() + 3600000).toString();

  existingUser.resetToken = passwordResetToken;
  existingUser.resetTokenExpiry = passwordResetExpires;
  const resetUrl = `${process.env.BASEURL}/reset-password/${resetToken}`;

  const emailBody = "Reset Password by clicking on following url:" + resetUrl;

  const msg = {
    to: body.email,
    from: "akash@crownstack.com",
    subject: "Reset Password",
    text: emailBody,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  try {
    const sent = await sgMail.send(msg);
    console.log(sent, "sent");

    await db.user.update({
      where: {
        email: body.email,
      },
      data: {
        resetToken: passwordResetToken,
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
