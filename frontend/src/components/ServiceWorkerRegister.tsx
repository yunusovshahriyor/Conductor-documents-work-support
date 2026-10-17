"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/basePath";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch(() => {
      /* offline support is an enhancement; ignore failures */
    });
  }, []);
  return null;
}
