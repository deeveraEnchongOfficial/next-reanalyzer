"use server";

import { EventLog } from "@prisma/client";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import {
  createRecord,
  findManyRecords,
  findUniqueRecord,
  updateRecord,
  deleteRecord,
} from "@/helpers/dbHelpers";
import { EventLogRequest } from "@/types/event-log";

export async function createEventLog(request: EventLogRequest) {
  const session = await auth();

  if (!session || !session?.user?.id) {
    console.error("No valid session or user ID found.");
    return;
  }

  const userExists = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!userExists) {
    await signOut();
  }

  const newLog = await createRecord<EventLog>({
    model: "eventLog",
    data: {
      ...request,
      userId: session?.user.id,
    },
  });

  return newLog;
}

export async function getEventLogs(where?: object) {
  const logs = await findManyRecords<EventLog>({
    model: "eventLog",
    where: where,
    include: { user: true },
  });

  return logs;
}

export async function getEventLogById(eventLogId: string) {
  const log = await findUniqueRecord<EventLog>({
    model: "eventLog",
    where: { id: eventLogId },
    include: { user: true },
  });

  return log;
}

export async function updateEventLog(request: EventLogRequest) {
  const updatedLog = await updateRecord<EventLog>({
    model: "eventLog",
    where: { id: request.id },
    data: {
      ...request,
    },
  });

  return updatedLog;
}

export async function deleteEventLog(eventLogId: string) {
  const deletedLog = await deleteRecord<EventLog>({
    model: "eventLog",
    where: { id: eventLogId },
  });

  return deletedLog;
}
