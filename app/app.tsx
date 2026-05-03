"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

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


    WEDDING: "/wedding",


    LOVE1: "/love1",


  };

  return {
    pathname,
    routes,

    // Navigation
    goTolanding: () => router.push(routes.LANDING),
    goToLogin: () => router.push(routes.LOGIN),
    goToRegister: () => router.push(routes.REGISTER),

    // ✅ FIXED
    goToHome: (query: string = "") => {
      router.push(routes.HOME + query);
    },



    goToWedding: () =>          router.push(routes.WEDDING),



     goTolove1: () =>          router.push(routes.LOVE1),




    goToDashboard: () => router.push(routes.DASHBOARD),
    goToCompare: () => router.push(routes.COMPARE),

    // Replace
    replaceToHome: () => router.replace(routes.HOME),

    // Back
    goBack: () => router.back(),

    // Route checks
    isLanding: pathname === routes.LANDING,
    isLogin: pathname === routes.LOGIN,
    isHome: pathname === routes.HOME,
    isDashboard: pathname === routes.DASHBOARD,
    isWedding: pathname === routes.WEDDING,


    islove1: pathname === routes.LOVE1,


  };
};
