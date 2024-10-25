import axios, { AxiosInstance } from "axios";
import { createEventLog } from "@/actions/event-log";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Use environment variables for the base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // If you need to include credentials like cookies
});

export const setBaseUrl = (
  url: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL
) => {
  apiInstance.defaults.baseURL =
    url === "" ? process.env.NEXT_PUBLIC_API_BASE_URL : url;
};

apiInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    createEventLog({
      event: "APIRequest",
      api: {
        endpoint: config.url,
        method: config.method?.toUpperCase(),
      },
    });
    return config;
  },
  (error) => {
    createEventLog({
      event: "APIRequestError",
      api: {
        endpoint: error.url,
        method: error.method?.toUpperCase(),
        status: error.status,
        error: error.message,
      },
    });
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    createEventLog({
      event: "APIResponse",
      api: {
        method: response.config.method?.toUpperCase(),
        endpoint: response.config.url,
        status: response.status.toString(),
      },
    });
    return response;
  },
  (error) => {
    createEventLog({
      event: "APIResponse",
      api: {
        method: error.response.method?.toUpperCase(),
        status: error.response?.status.toString(),
        endpoint: error.response?.config.url,
        error: error.message,
      },
    });
    // Handle errors globally
    if (error.response?.status === 401) {
      // Redirect to login or handle unauthorized error
    }
    return Promise.reject(error);
  }
);

export default apiInstance;

// import axios, { AxiosInstance } from 'axios';
// import { createEventLog } from '@/actions/event-log';

// // Function to create a new Axios instance with interceptors
// const apiInstance = (baseURL: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL): AxiosInstance => {
//   const apiInstance = axios.create({
//     baseURL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     withCredentials: true,
//   });

//   apiInstance.interceptors.request.use(
//     (config) => {
//       // const token = localStorage.getItem('token');
//       // if (token) {
//       //   config.headers['Authorization'] = `Bearer ${token}`;
//       // }
//       createEventLog({
//         event: 'APIRequest',
//         userId: '66bdf0d99f573cee6f306fc7',
//         api: {
//           endpoint: config.url,
//           method: config.method?.toUpperCase(),
//         }
//       });
//       return config;
//     },
//     (error) => {
//       createEventLog({
//         event: 'APIRequestError',
//         userId: '66bdf0d99f573cee6f306fc7',
//         api: {
//           endpoint: error.url,
//           method: error.method?.toUpperCase(),
//           status: error.status,
//           error: error.message,
//         }
//       });
//       return Promise.reject(error);
//     }
//   );

//   apiInstance.interceptors.response.use(
//     (response) => {
//       createEventLog({
//         event: 'APIResponse',
//         userId: '66bdf0d99f573cee6f306fc7',
//         api: {
//           method: response.config.method?.toUpperCase(),
//           endpoint: response.config.url,
//           status: response.status.toString(),
//         }
//       });
//       return response;
//     },
//     (error) => {
//       createEventLog({
//         event: 'APIResponse',
//         userId: '66bdf0d99f573cee6f306fc7',
//         api: {
//           method: error.response.method?.toUpperCase(),
//           status: error.response?.status.toString(),
//           endpoint: error.response?.config.url,
//           error: error.message,
//         }
//       });
//       // Handle errors globally
//       if (error.response?.status === 401) {
//         // Redirect to login or handle unauthorized error
//       }
//       return Promise.reject(error);
//     }
//   );

//   return apiInstance;
// };

// export default apiInstance;
