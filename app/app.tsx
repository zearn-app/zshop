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
    LANDING: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    HOME: "/home",
    DASHBOARD: "/dashboard",
    COMPARE: "/compare",
  };

  return {
    // Current route
    pathname,

    // Route constants
    routes,

    // Navigation helpers
    goTolanding: () => router.push(routes.LANDING),
    goToLogin: () => router.push(routes.LOGIN),
    goToRegister: () => router.push(routes.REGISTER),
    goToHome: () = (query: string = "") => {router.push(routes.HOME + query);},
    goToDashboard: () => router.push(routes.DASHBOARD),
    goToCompare: () => router.push(routes.COMPARE),

    // Replace (no history)
    replaceToHome: () => router.replace(routes.HOME),

    // Back
    goBack: () => router.back(),

    // Route checks
    isLanding: pathname ===            routes.LANDING,
    isLogin: pathname === routes.LOGIN,        
isHome: pathname === routes.HOME,
    isDashboard: pathname === routes.DASHBOARD,
  };
};