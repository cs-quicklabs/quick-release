import { db } from "@/lib/db";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db.user.findUnique({
      where: {
        email: params.id,
      },
    });
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
      const emailBody = `Hi ${params.id}
      Welcome to Quicklabs! We're thrilled to have you on board
      Our mission is simple: to streamline change log management for all your software releases. With Quicklabs, you'll experience efficiency and clarity like never before.
      Best regards,
      Quick Release Team
      
      <a href="${verificationUrl}">Click to verify Account</a>,
      `;
      const msg = {
        to: params.id,
        from: "akash@crownstack.com",
        subject: "Welcome to Quick Release",
        html: emailBody,
      };
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

      sgMail.send(msg);
    }
    if (!user) {
      throw new Error("Email is not registred");
    }
    try {
      await db.user.update({
        where: {
          email: params.id,
        },
        data: {
          verificationToken: verificationToken,
          verificationTokenExpiry: verificationTokenExpires,
          isActive: true,
          isVerified: true,
        },
      });

      return NextResponse.json("Verification Link Sent to email", {
        status: 200,
      });
    } catch (err) {
      console.log(err);
      await db.user.update({
        where: {
          email: params.id,
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
