
"use client";

import { useEffect } from "react";
import { nextServer } from "@/lib/api/api";
import { checkSession } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";

export default function AuthInterceptor() {
    const  router = useRouter()
  useEffect(() => {
    const interceptor = nextServer.interceptors.response.use(
      (response) => response,
        async (error) => {
    //           if (error.response?.status === 401) {
    //   // Optionally handle redirect or refresh here
    //   return Promise.resolve({ data: null }); // suppress error
    // }
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const isSession = await checkSession();
          if (!isSession) {
             router.push("/auth/register");
            return Promise.reject(error);
          }
          return nextServer(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => nextServer.interceptors.response.eject(interceptor);
  }, [router]);

  return null;
}
