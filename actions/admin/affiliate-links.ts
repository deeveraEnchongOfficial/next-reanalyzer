"use server";

import { AffiliateLink } from "@prisma/client";
import { AffiliateLinkRequest } from "@/types/affiliate-link";
import {
  createRecord,
  findManyRecords,
  updateRecord,
  deleteRecord,
} from "@/helpers/dbHelpers";

export async function createAffiliateLink(request: AffiliateLinkRequest) {
  const { id, updatedAt, ...finalRequest } = request; //remove id from request
  const newAffiliateLink = await createRecord<AffiliateLink>({
    model: "affiliateLink",
    data: {
      ...finalRequest,
      createdAt: new Date(),
      updatedAt: null,
    },
  });

  return newAffiliateLink;
}

export async function getAllAffiliateLinks() {
  const subscriptions = await findManyRecords<AffiliateLink>({
    model: "affiliateLink",
  });

  return subscriptions;
}

export async function updateAffiliateLink(request: AffiliateLinkRequest) {
  const { id, createdAt, updatedAt, ...finalRequest } = request; //remove id from request
  const updatedAffiliateLink = await updateRecord<AffiliateLink>({
    model: "affiliateLink",
    where: { id: request.id },
    data: {
      ...finalRequest,
    },
  });

  return updatedAffiliateLink;
}

export async function deleteAffiliateLink(subscriptionId: string) {
  const deletedAffiliateLink = await deleteRecord<AffiliateLink>({
    model: "affiliateLink",
    where: { id: subscriptionId },
  });

  return deletedAffiliateLink;
}
