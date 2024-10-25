import { getEventLogs } from "@/actions/event-log";
import { useSession } from "next-auth/react";

export const usePropertyDetail = () => {
  const session = useSession();

  const hasDeepDived = async (propertyId?: string) => {
    if (!propertyId) return false;

    const result = await getEventLogs({
      event: "ButtonClicked",
      userId: session?.data?.user?.id,
      AND: [
        {
          app: {
            not: null, // Check that the app object is not null
          },
        },
        {
          app: {
            path: ["source"],
            not: null,
          },
        },
        {
          app: {
            path: ["source"],
            equals: "deep_dive",
          },
        },
      ],
    });

    // Manually filter the logs where the app.page contains `propertyId`
    const filteredResult = result?.filter((log) => {
      const page = (log.app as { page?: string })?.page;
      return typeof page === "string" && page.includes(propertyId);
    });

    return filteredResult?.length > 0;

    //return result.length > 0; // allowed deep dive
  };

  const isRefreshAllowed = async () => {
    const result = await getEventLogs({
      event: "ButtonClicked",
      userId: session?.data?.user?.id,
      AND: [
        {
          app: {
            not: null, // Check that the app object is not null
          },
        },
        {
          app: {
            path: ["source"],
            not: null,
          },
        },
        {
          app: {
            path: ["source"],
            equals: "deep_dive",
          },
        },
      ],
    });

    return result.length < 5; // allowed deep dive
  };

  return { isRefreshAllowed, hasDeepDived };
};
