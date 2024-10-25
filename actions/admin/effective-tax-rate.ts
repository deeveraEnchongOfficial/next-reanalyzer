"use server";

import { EffectiveTaxRate } from "@prisma/client";
import {
  findManyRecords,
  deleteRecord,
} from "@/helpers/dbHelpers";

export async function getAllEffectiveTaxRate() {
  const effectiveTaxRate = await findManyRecords<EffectiveTaxRate>({
    model: "effectiveTaxRate",
  });

  return effectiveTaxRate;
}

export async function deleteEffectiveTaxRate(effectiveTaxRateId: string) {
  const deleteEffectiveTaxRate = await deleteRecord<EffectiveTaxRate>({
    model: "effectiveTaxRate",
    where: { id: effectiveTaxRateId },
  });

  return deleteEffectiveTaxRate;
}
