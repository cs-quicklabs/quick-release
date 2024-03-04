import { db } from "@/lib/db";
import sgMail from "@sendgrid/mail";
import { hash } from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  if (!params.id) {
    throw new Error("Invalid User");
  }
  try {
    const checkUserFromEmail = await db.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (checkUserFromEmail) {
      body.isVerified = true;
      if (checkUserFromEmail.id !== params.id) {
        throw new Error("This Email Already Exists");
      }
    } else {
      body.isVerified = false;
      const user = await db.user.update({
        where: {
          id: params.id,
        },
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          profilePicture: body.profilePicture,
          isVerified: body.isVerified,
        },
      });

      const verificationToken = crypto.randomBytes(20).toString("hex");
      const registerVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

      const verificationTokenExpires = (Date.now() + 3600000).toString();
      user.verificationToken = registerVerificationToken;
      user.verificationTokenExpiry = verificationTokenExpires;
      const verificationUrl = `${process.env.BASEURL}/?token=${verificationToken}`;

      const msg = {
        to: body.email,
        from: "akash@crownstack.com",
        subject: "Welcome to Quick Release",
        text: `Hi ${body.firstName}
      Welcome to Quicklabs! We're thrilled to have you on board
      Our mission is simple: to streamline change log management for all your software releases. With Quicklabs, you'll experience efficiency and clarity like never before.
      Best regards,
      Quick Release Team
      
      Click to verify email ${verificationUrl}
      `,
      };
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
      try {
        if (user.id) {
          sgMail.send(msg);
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
      } catch (err) {
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
    }
    const updatedUser = await db.user.update({
      where: {
        id: params.id,
      },
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        profilePicture: body.profilePicture,
        isVerified: body.isVerified,
      },
    });
    if (!updatedUser) {
      throw new Error("Update Failed");
    }
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
      },
      { status: 400 }
    );
  }
}
