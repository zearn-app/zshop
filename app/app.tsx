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

    ADMIN: "/admin",
    ADMIN_PRODUCT: "/admin-product",

    PRODUCT: (id: string) => `/product/${id}`, // 🔥 dynamic route
  };

  return {
    pathname,
    routes,

    // 🔁 Navigation
    goToLanding: () => router.push(routes.LANDING),
    goToLogin: () => router.push(routes.LOGIN),
    goToRegister: () => router.push(routes.REGISTER),

    goToHome: (query: string = "") => {
      router.push(routes.HOME + query);
    },

    goToDashboard: () => router.push(routes.DASHBOARD),

    // 🔥 Admin
    goToAdmin: () => router.push(routes.ADMIN),
    goToAdminProduct: () => router.push(routes.ADMIN_PRODUCT),

    // 🔥 Product navigation
    goToProduct: (id: string) => {
      router.push(routes.PRODUCT(id));
    },

    // 🔄 Replace
    replaceToHome: () => router.replace(routes.HOME),

    // 🔙 Back
    goBack: () => router.back(),

    // ✅ Route checks
    isLanding: pathname === routes.LANDING,
    isLogin: pathname === routes.LOGIN,
    isRegister: pathname === routes.REGISTER,
    isHome: pathname === routes.HOME,
    isDashboard: pathname === routes.DASHBOARD,
    isAdmin: pathname === routes.ADMIN,
  };
};