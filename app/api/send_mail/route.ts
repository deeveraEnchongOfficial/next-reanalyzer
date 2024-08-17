import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, subject, text } = await request.json();

    if (!to || !subject || !text) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'sparkles.sweet14344@gmail.com', // Replace with your email
        pass: process.env.SMTP_PASS || 'nlivrwbfdvfkvcjn', // Replace with your email password
      },
    });

    const mailOptions = {
      from: '"No-Reply" <sparkles.sweet14344@gmail.com', // Replace with your email and name
      to,
      subject,
      html: `<p>${text}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  }
  catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}