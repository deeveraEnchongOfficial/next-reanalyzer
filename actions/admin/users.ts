"use server";

import bcrypt from "bcrypt";
import { User, UserRole } from "@prisma/client";
import { getUserById, getUserByEmail } from "@/data/user";
import { UserRequest } from "@/types/user";
import { findManyRecords, updateRecord } from "@/helpers/dbHelpers";
import { generatePassword } from "@/helpers/genericHelpers";
import { postData } from "@/helpers/apiHelpers";
import { ResponseError } from "@/errors/responseError";

export async function getAllUsers() {
  const users = await findManyRecords<User>({
    model: "user",
    where: { role: UserRole.USER },
  });

  return users;
}

export async function updateUser(request: UserRequest) {
  const errors: string[] = [];

  const existingUserByEmail = await getUserByEmail(request.email as string);

  if (existingUserByEmail !== null && existingUserByEmail.id !== request.id) {
    errors.push("Email already in use");

    return { errors: errors };
  }

  const existingUserById = await getUserById(request.id as string);

  const { id, password, ...finalRequest } = request; //remove id from request

  const updatedUser = await updateRecord<User>({
    model: "user",
    where: { id: request.id },
    data: {
      ...finalRequest,
    },
  });

  const updatedFields: { label: string; oldValue: string; newValue: string }[] =
    [];

  if (existingUserById?.email !== updatedUser.email) {
    updatedFields.push({
      label: "Email Address",
      oldValue: existingUserById?.email as string,
      newValue: updatedUser.email as string,
    });
  }

  if (existingUserById?.name !== updatedUser.name) {
    updatedFields.push({
      label: "Name",
      oldValue: existingUserById?.name as string,
      newValue: updatedUser.name as string,
    });
  }

  if (updatedFields.length > 0) {
    try {
      const updatedFieldsList = updatedFields
        .map((field) => {
          return `
                    <li><strong>${field.label}:</strong><br>
                        <em>Old Value:</em> ${field.oldValue}<br>
                        <em>New Value:</em> ${field.newValue}
                    </li>
                `;
        })
        .join("");

      const response = await postData(
        `send-mail`,
        "",
        JSON.stringify({
          to: existingUserById?.email,
          subject: "Update Notification: Changes to Your Account Information",
          html: `<p>Dear <strong>${existingUserById?.name}</strong>,</p>
    
                      <p>We hope this message finds you well. We are writing to inform you that some of the information associated with your account has been recently updated. Below are the details of the changes:</p>
    
                      <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
    
                      <h3 style="color: #0056b3;">Updated Fields:</h3>
    
                      <ul>
                        ${updatedFieldsList}
                      </ul>
    
                      <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
    
                      <p><strong>Please Review:</strong></p>
                      <p>We recommend that you review these changes to ensure everything is accurate. If you did not authorize these changes or if any of the information is incorrect, please contact our support team immediately at <a href="mailto:support@example.com">support@example.com</a> or <strong>[Phone Number]</strong>.</p>
    
                      <p>Thank you for your attention to this matter.</p>
    
                      <p>Best regards,<br>
                      Reanalyzer AI<br>
                `,
        })
      );

      console.log(response);
    } catch (error) {
      if (error instanceof ResponseError) {
        errors.push("Can't send notification email");
        return { errors: errors };
      } else {
        errors.push("Can't send notification email");
        return { errors: errors };
      }
    }
  }

  return updatedUser;
}

export async function resetUserPassword(request: UserRequest) {
  const errors: string[] = [];

  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await updateRecord<User>({
    model: "user",
    where: { id: request.id },
    data: {
      password: hashedPassword,
    },
  });

  try {
    const response = await postData(
      `send-mail`,
      "",
      JSON.stringify({
        to: updatedUser?.email,
        subject: "Your New Password",
        html: `
              <p>Hi ${updatedUser.name},</p>
              <p>Your new password has been generated. Please use the password below to log in to your account:</p>
  
              <div class="password-box">
                  <b>${password}</b>
              </div>
  
              <p>We strongly recommend that you change this password as soon as you log in to ensure the security of your account.</p>
  
              <p>If you did not request this change or have any concerns, please contact our support team immediately.</p>
  
              <p>Thank you,<br>The Reanalyzer AI Team</p>
            `,
      })
    );

    console.log(response);
  } catch (error) {
    if (error instanceof ResponseError) {
      errors.push("Can't send notification email");
      return { errors: errors };
    } else {
      errors.push("Can't send notification email");
      return { errors: errors };
    }
  }

  return updatedUser;
}
