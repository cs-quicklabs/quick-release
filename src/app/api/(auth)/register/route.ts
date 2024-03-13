import { transport } from "@/Utils/EmailService";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import crypto from "crypto";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(request: Request, res: NextApiResponse) {
  try {
    const body = await request.json();
    const hashedPassword = await hash(body.password, 10);

    const existingEmail = await db.user.findUnique({
      where: { email: body.email },
    });

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    const organisation = await db.organisation.create({
      data: {
        name: body.orgName,
      },
    });
    const register = await db.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        organisationId: organisation.id,
      },
    });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const registerVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationTokenExpires = (Date.now() + 7200000).toString();
    register.verificationToken = registerVerificationToken;
    register.verificationTokenExpiry = verificationTokenExpires;
    const verificationUrl = `${process.env.BASEURL}/?token=${verificationToken}`;
    const emailBody = `Hi ${body.firstName}
      Welcome to Quicklabs! We're thrilled to have you on board
      Our mission is simple: to streamline change log management for all your software releases. With Quicklabs, you'll experience efficiency and clarity like never before.
      Best regards,
      Quick Release Team
      
      <a href="${verificationUrl}">Click to verify Account</a>,
      `;

    const msg = {
      to: body.email,
      from: process.env.EMAIL_FROM,
      subject: "Welcome to Quick Release",
      html: emailBody,
    };

    try {
      if (register.id) {
        transport.sendMail(msg);
      }
      await db.user.update({
        where: {
          email: body.email,
        },
        data: {
          verificationToken: verificationToken,
          verificationTokenExpiry: verificationTokenExpires,
        },
      });
      return NextResponse.json("Verification Link Sent to email", {
        status: 200,
      });
    } catch (err: any) {
      await db.user.update({
        where: {
          email: body.email,
        },
        data: {
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });
      throw new Error("Unable to sent verification link");
    }
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
      },
      { status: 400 }
    );
  }
}
