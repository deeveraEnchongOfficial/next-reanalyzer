import { PrismaClient, Prisma } from "@prisma/client";

import { db } from "@/lib/db";

interface CreateInput {
  model: keyof PrismaClient;
  data: any;
}

interface UpdateInput {
  model: keyof PrismaClient;
  where: object;
  data: any;
}

interface DeleteInput {
  model: keyof PrismaClient;
  where: object;
}

interface FindInput {
  model: keyof PrismaClient;
  where?: object;
  include?: object;
  orderBy?: object;
  take?: number;
}

export const createRecord = async <T>({
  model,
  data,
}: CreateInput): Promise<T> => {
  const result = await (db[model] as any).create({
    data,
  });
  return result;
};

export const findManyRecords = async <T>({
  model,
  where = {},
  include = {},
  orderBy = {},
  take,
}: FindInput): Promise<T[]> => {
  const records = await (db[model] as any).findMany({
    where,
    include,
    orderBy,
    take,
  });
  return records;
};

export const findUniqueRecord = async <T>({
  model,
  where,
  include = {},
}: FindInput): Promise<T | null> => {
  const record = await (db[model] as any).findUnique({
    where,
    include,
  });
  return record;
};

export const updateRecord = async <T>({
  model,
  where,
  data,
}: UpdateInput): Promise<T> => {
  const updatedRecord = await (db[model] as any).update({
    where,
    data,
  });
  return updatedRecord;
};

export const deleteRecord = async <T>({
  model,
  where,
}: DeleteInput): Promise<T> => {
  const deletedRecord = await (db[model] as any).delete({
    where,
  });
  return deletedRecord;
};
