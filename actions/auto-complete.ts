"use server";

import { cache } from 'react';
import * as z from "zod";
import { AutoCompleteSchema } from "@/schemas";

export const autoComplete = cache(async (
  values: z.infer<typeof AutoCompleteSchema>
): Promise<{ success?: any; error?: string }> => {
  // Validate the input using Zod schema
  const validatedFields = AutoCompleteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Search term is required!" };
  }

  const { search } = validatedFields.data;

  // Retrieve environment variables
  const apiKey = process.env.REAL_STATE_API_KEY;
  const apiUrl = process.env.REAL_STATE_BASE_API_URL;

  if (!apiKey || !apiUrl) {
    return { error: "API configuration is missing!" };
  }

  try {
    // Send the API request
    const response = await fetch(`${apiUrl}/v2/AutoComplete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        search,
        search_types: ["A"],
      }),
    });

    if (!response.ok) {
      // Handle non-200 HTTP responses
      const errorMessage = await response.text();
      return { error: `Failed to fetch data: ${response.status} ${errorMessage}` };
    }

    // Parse and return the response data
    const data = await response.json();
    return { success: data };
  } catch (error) {
    // Handle fetch errors (network issues, etc.)
    return { error: `An error occurred: ${(error as Error).message}` };
  }
});
