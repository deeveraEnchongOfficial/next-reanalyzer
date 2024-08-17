"use server";

import * as z from "zod";
import bcrypt from "bcrypt";

import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
// import { sendVerificationEmail } from "@/lib/mailer";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  const confirmLink = `https://next-reanalyzer.vercel.app/auth/new-verification?token=${verificationToken.token}`;
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);

  // sent post request to send-mail route `api/send-mail` to send email
  // console.log(`${process.env.REAL_STATE_BASE_API_URL}/api/send-mail`);
  // console.log(`${process.env.NEXTAUTH_URL}/auth/new-verification?token=${verificationToken}`);
  const response = await fetch(`${process.env.REAL_STATE_BASE_API_URL}/api/send-mail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: email,
      subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
    }),
  });

  return { sucess: "Confirmation email sent!" };
};
