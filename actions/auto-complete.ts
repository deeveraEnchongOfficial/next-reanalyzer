"use server";

import { cache } from "react";
import * as z from "zod";
import { AutoCompleteSchema } from "@/schemas";
type AutoCompleteType = Partial<z.infer<typeof AutoCompleteSchema>> & {
  search: string;
  searchType?: string[];
};

export const autoComplete = cache(
  async (
    values: AutoCompleteType
  ): Promise<{ success?: any; error?: string }> => {
    const validatedFields = AutoCompleteSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Search term is required!" };
    }

    const { search, searchType } = validatedFields.data;


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
          search_types: searchType,
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
