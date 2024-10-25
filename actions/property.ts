"use server";

import { Property } from "@prisma/client";
import { auth } from "@/auth";
import {
  createRecord,
  findManyRecords,
  findUniqueRecord,
  updateRecord,
  deleteRecord,
} from "@/helpers/dbHelpers";
import { PropertyInfoRequest } from "@/types/property";

export async function createProperty(request: PropertyInfoRequest) {
  const newProperty = await createRecord<Property>({
    model: "property",
    data: {
      ...request,
      createdAt: new Date(),
      updatedAt: null,
    },
  });

  return newProperty;
}

export async function getProperties(where?: object) {
  const properties = await findManyRecords<Property>({
    model: "property",
    where: where,
  });

  return properties;
}

export async function getProperty(propertyId: string) {
  const properties = await findManyRecords<Property>({
    model: "property",
    where: { propertyId: propertyId },
  });

  return properties[0] || null;
}

export async function updateProperty(request: PropertyInfoRequest) {
  const updatedProperty = await updateRecord<Property>({
    model: "property",
    where: { id: request.id },
    data: {
      ...request,
      updatedAt: new Date(),
    },
  });

  return updatedProperty;
}

export async function deleteProperty(propertyInfoId: string) {
  const deletedProperty = await deleteRecord<Property>({
    model: "property",
    where: { id: propertyInfoId },
  });

  return deletedProperty;
}
