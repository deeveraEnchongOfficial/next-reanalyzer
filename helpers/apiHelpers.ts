import { ResponseError } from "@/errors/responseError";
import { isErrorStatusCode } from "./genericHelpers";
import apiInstance, { setBaseUrl } from "@/lib/apiInstance";

export const apiData = async <T>(
  method: string,
  url: string,
  data: unknown = {},
  params: unknown = {},
  headers: Record<string, string> = {},
  baseURL?: string
): Promise<T> => {
  try {
    setBaseUrl(baseURL);
    const config: Record<string, any> = {
      method,
      url,
      params,
      headers,
    };

    if (method !== "get") {
      config.data = data;
    }

    const response = await apiInstance(config)
      .then((response) => response.data)
      .catch((error) => error.response);

    if (isErrorStatusCode(response.status)) {
      throw new ResponseError(response.data.message, response.status);
    }

    return response;
  } catch (error) {
    if (error instanceof ResponseError) {
      throw new ResponseError(error.message, error.status);
    } else {
      throw new Error(error?.toString());
    }
  }
};

export const getData = async <T>(
  endpoint: string,
  baseURL: string = "",
  params: unknown = {},
  headers: Record<string, string> = {}
): Promise<T> => {
  return apiData<T>("get", endpoint, {}, params, headers, baseURL);
};

export const postData = async <T>(
  endpoint: string,
  baseURL: string = "",
  data: unknown,
  headers: Record<string, string> = {}
): Promise<T> => {
  return apiData<T>("post", endpoint, data, {}, headers, baseURL);
};

export const putData = async <T>(
  endpoint: string,
  baseURL: string = "",
  data: unknown,
  headers: Record<string, string> = {}
): Promise<T> => {
  return apiData<T>("put", endpoint, data, {}, headers, baseURL);
};

export const deleteData = async <T>(
  endpoint: string,
  baseURL: string = "",
  headers: Record<string, string> = {}
): Promise<T> => {
  return apiData<T>("delete", endpoint, {}, {}, headers, baseURL);
};
