import { db } from "@/lib/db";

export const getSubscriptionById = async (id: string) => {
  try {
    const subscription = await db.subscription.findUnique({ where: { id } });

    return subscription;
  } catch (error) {
    return null;
  }
};

export const getSubscriptionByUserId = async (userId: string) => {
  try {
    const subscription = await db.subscription.findFirst({
      where: { userId },
    });

    return subscription;
  } catch (error) {
    return null;
  }
};

export const getAllsubscription = async () => {
  try {
    const subscription = await db.subscription.findMany();

    return subscription;
  } catch (error) {
    return null;
  }
};
