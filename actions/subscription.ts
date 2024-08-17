"use server";

import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

export const createUserSubscription = async (userId: string) => {
  try {
    const existingUser = await getUserById(userId);

    if (!existingUser) {
      return { error: "User does not exist!" };
    }

    await db.subscription.create({
      data: {
        userId: existingUser.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    return { success: "Subscription created!" };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return { error: "Failed to create subscription." };
  }
};
