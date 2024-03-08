import { createTransport } from "nodemailer";
import SMTPConnection from "nodemailer/lib/smtp-connection";

import { env } from "@/lib/env";
import { EMAIL_SENDER } from "@/lib/constants";

const smtpConfig: SMTPConnection.Options = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  secure: true,
};

const transporter = createTransport(smtpConfig);

export interface MailMessage {
  to: string;
  subject: string;
  body: string;
}

export async function sendMail(message: MailMessage) {
  const { to, subject, body } = message;
  const t = transporter.sendMail({
    from: EMAIL_SENDER,
    to,
    subject,
    html: body,
  });
  return t;
}
