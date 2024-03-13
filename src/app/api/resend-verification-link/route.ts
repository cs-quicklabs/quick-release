import { transport } from "@/Utils/EmailService";
import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await db.user.findUnique({
      where: {
        email: body.email,
      },
    });
    console.log(user, "userFound");
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const registerVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationTokenExpires = (Date.now() + 360000).toString();

    if (user) {
      user.verificationToken = registerVerificationToken;
      user.verificationTokenExpiry = verificationTokenExpires;
      const verificationUrl = `${process.env.BASEURL}/?token=${verificationToken}`;
      const emailBody = `Hi ${user.firstName}
      Welcome to Quicklabs! We're thrilled to have you on board
      Our mission is simple: to streamline change log management for all your software releases. With Quicklabs, you'll experience efficiency and clarity like never before.
      Best regards,
      Quick Release Team
      
      <a href="${verificationUrl}">Click to verify Account</a>,
      `;
      const msg = {
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: "Welcome to Quick Release",
        html: emailBody,
      };
      transport.sendMail(msg);
    }
    if (!user) {
      throw new Error("Email is not registred");
    }
    try {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          verificationToken: verificationToken,
          verificationTokenExpiry: verificationTokenExpires,
        },
      });

      return NextResponse.json("Verification Link Sent to email", {
        status: 200,
      });
    } catch (err) {
      console.log(err);
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });
      throw new Error("Unable to sent verification link");
    }
  } catch (e: any) {
    NextResponse.json(
      {
        message: e.message,
      },
      { status: 400 }
    );
  }
}
