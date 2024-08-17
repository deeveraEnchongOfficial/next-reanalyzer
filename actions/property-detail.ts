"use server";

import { cache } from 'react';
import * as z from "zod";
import { PropertyDetailSchema } from "@/schemas";

export const propertyDetail = cache(async (
  values: z.infer<typeof PropertyDetailSchema>
): Promise<{ success?: any; error?: string }> => {
  // Validate the input using Zod schema
  const validatedFields = PropertyDetailSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { id } = validatedFields.data;

  // Retrieve environment variables
  const apiKey = process.env.REAL_STATE_API_KEY;
  const apiUrl = process.env.REAL_STATE_BASE_API_URL;

  if (!apiKey || !apiUrl) {
    return { error: "API configuration is missing!" };
  }

  try {
    // Send the API request
    const response = await fetch(`${apiUrl}/v2/PropertyDetail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ id }),
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
