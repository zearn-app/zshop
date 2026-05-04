"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

/* ================= ROUTE TYPES ================= */

type Routes = {
  LANDING: string;
  LOGIN: string;
  REGISTER: string;
  HOME: string;
  DASHBOARD: string;
  ADMIN: string;
  ADMIN_PRODUCT: string;
  PRODUCT: (id: string) => string;
};

/* ================= HOOK ================= */

export const useApp = () => {
  const router = useRouter();
  const pathname = usePathname();

  /* ================= ROUTES ================= */

  const routes: Routes = useMemo(
    () => ({
      LANDING: "/",
      LOGIN: "/login",
      REGISTER: "/register",
      HOME: "/home",
      DASHBOARD: "/dashboard",

      ADMIN: "/admin",
      ADMIN_PRODUCT: "/admin-product",

      PRODUCT: (id: string) => `/product/${id}`,
    }),
    []
  );

  /* ================= NAVIGATION ================= */

  const goTo = (path: string) => router.push(path);
  const replaceTo = (path: string) => router.replace(path);

  const goToHome = (query?: Record<string, string>) => {
    if (!query) return router.push(routes.HOME);

    const queryString = new URLSearchParams(query).toString();
    router.push(`${routes.HOME}?${queryString}`);
  };

  const goToProduct = (id: string) => {
    if (!id) return console.warn("Product ID missing");
    router.push(routes.PRODUCT(id));
  };

  /* ================= ROUTE CHECKS ================= */

  const isActive = (path: string) => pathname === path;

  const isStartsWith = (path: string) => pathname.startsWith(path);

  const routeState = useMemo(
    () => ({
      isLanding: isActive(routes.LANDING),
      isLogin: isActive(routes.LOGIN),
      isRegister: isActive(routes.REGISTER),
      isHome: isActive(routes.HOME),
      isDashboard: isActive(routes.DASHBOARD),

      isAdmin: isStartsWith(routes.ADMIN),

      // 🔥 Dynamic route check
      isProduct: pathname.startsWith("/product"),
    }),
    [pathname, routes]
  );

  /* ================= RETURN ================= */

  return {
    pathname,
    routes,

    /* Navigation */
    goToLanding: () => goTo(routes.LANDING),
    goToLogin: () => goTo(routes.LOGIN),
    goToRegister: () => goTo(routes.REGISTER),
    goToHome,
    goToDashboard: () => goTo(routes.DASHBOARD),

    goToAdmin: () => goTo(routes.ADMIN),
    goToAdminProduct: () => goTo(routes.ADMIN_PRODUCT),

    goToProduct,

    replaceToHome: () => replaceTo(routes.HOME),

    goBack: () => router.back(),

    /* Route helpers */
    isActive,
    isStartsWith,

    ...routeState,
  };
};