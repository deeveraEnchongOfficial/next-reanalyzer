"use server";

import { SubPlan } from "@prisma/client";
import { SubPlanRequest } from "@/types/subscription";
import {
  createRecord,
  findManyRecords,
  updateRecord,
  deleteRecord,
} from "@/helpers/dbHelpers";

export async function createSubscription(request: SubPlanRequest) {
  const { id, updatedAt, ...finalRequest } = request; //remove id from request
  const newSubscription = await createRecord<SubPlan>({
    model: "subPlan",
    data: {
      ...finalRequest,
      createdAt: new Date(),
      updatedAt: null,
    },
  });

  return newSubscription;
}

export async function getAllSubscriptions() {
  const subscriptions = await findManyRecords<SubPlan>({
    model: "subPlan",
  });

  return subscriptions;
}

export async function updateSubscription(request: SubPlanRequest) {
  const { id, createdAt, updatedAt, ...finalRequest } = request; //remove id from request
  const updatedSubscription = await updateRecord<SubPlan>({
    model: "subPlan",
    where: { id: request.id },
    data: {
      ...finalRequest,
    },
  });

  return updatedSubscription;
}

export async function deleteSubscription(subscriptionId: string) {
  const deletedSubscription = await deleteRecord<SubPlan>({
    model: "subPlan",
    where: { id: subscriptionId },
  });

  return deletedSubscription;
}
