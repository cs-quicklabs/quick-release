import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,

  port: Number(process.env.EMAIL_PORT),

  host: String(process.env.EMAIL_HOST),

  secure: false,

  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD,
  },
});
