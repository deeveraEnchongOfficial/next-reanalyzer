"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
// import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  // await sendPasswordResetEmail(
  //   passwordResetToken.email,
  //   passwordResetToken.token
  // );

  // sent post request to send-mail route `api/send-mail` to send email
  const response = await fetch(
    `${process.env.REAL_STATE_BASE_API_URL}/api/send-mail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${passwordResetToken.token}">here</a> to reset your password.</p>`,
      }),
    }
  );

  return { success: "Reset email sent!" };
};
