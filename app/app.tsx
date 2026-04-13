"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Central App Router Controller
 * Use this anywhere in your app for navigation + route checks
 */

export const useApp = () => {
  const router = useRouter();
  const pathname = usePathname();

  const routes = {
    HOME: "/",
    LOGIN: "/login.tsx",
    DASHBOARD: "/dashboard",
    COMPARE: "/compare",
  };

  return {
    // Current route
    pathname,

    // Route constants
    routes,

    // Navigation helpers
    goToHome: () => router.push(routes.HOME),
    goToLogin: () => router.push(routes.LOGIN),
    goToDashboard: () => router.push(routes.DASHBOARD),
    goToCompare: () => router.push(routes.COMPARE),

    // Replace (no history)
    replaceToHome: () => router.replace(routes.HOME),

    // Back
    goBack: () => router.back(),

    // Route checks
    isHome: pathname === routes.HOME,
    isLogin: pathname === routes.LOGIN,
    isDashboard: pathname === routes.DASHBOARD,
  };
};