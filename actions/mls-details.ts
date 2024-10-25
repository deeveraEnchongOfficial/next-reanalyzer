"use server";

import { cache } from "react";
import * as z from "zod";

const MLSDetailSchema = z.object({
  mlsId: z.string(),
});

export const mlsDetails = cache(
  async (
    values: z.infer<typeof MLSDetailSchema>
  ): Promise<{ success?: any; error?: string }> => {
    const validatedFields = MLSDetailSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "MLS ID is required!" };
    }

    const { mlsId } = validatedFields.data;

    // Retrieve environment variables
    const apiKey = process.env.REAL_STATE_API_KEY;
    const apiUrl = process.env.REAL_STATE_BASE_API_URL;

    if (!apiKey || !apiUrl) {
      return { error: "API configuration is missing!" };
    }

    try {
      const response = await fetch(`${apiUrl}/v2/MLSDetail`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          mlsId,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        return {
          error: `Failed to fetch data: ${response.status} ${errorMessage}`,
        };
      }

      const data = await response.json();
      return { success: data };
    } catch (error) {
      return { error: `An error occurred: ${(error as Error).message}` };
    }
  }
);
