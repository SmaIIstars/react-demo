import { lazy } from "react";
import { set } from "lodash";

import { prefixStr, subRoutesKey, baseUrl } from "./constants";
import { getKeyPathStartPos, getComponents, getModules } from "./utils";
// type
import type { RouterConfig } from "@/router";

/**
 * Serialize routes
 * @param routes
 * @returns
 */
const serializeRoutes = (routes: RouterConfig[]) => {
  routes = Object.values(routes);
  const routeQueue = [...routes];

  while (routeQueue.length) {
    const route = routeQueue.pop()!;
    if (Reflect.get(route, subRoutesKey)) {
      Reflect.set(
        route,
        subRoutesKey,
        Object.values(Reflect.get(route, subRoutesKey))
      );
      routeQueue.push(...(Reflect.get(route, subRoutesKey) as any[]));
    }
  }

  return routes;
};

const getRoutes = (blackRouterList: string[] = []): RouterConfig[] => {
  let routeList: RouterConfig[] = [];
  const modules = getModules(blackRouterList),
    components = getComponents();

  for (const key in modules) {
    if (!components[key]) return [];

    const keyPathArr = key.split("/");
    const path = keyPathArr.slice(getKeyPathStartPos(keyPathArr) + 1, -1);

    let finalPath = path.join(`/${subRoutesKey}/`).split("/");

    const {
      name = "",
      isAutoRegisterRoute = true,
      dynamicRouteParams,
      redirectUri,
      exact = true,
    } = components[key]?.default?.type ?? {};

    if (isAutoRegisterRoute) {
      const templateRoute = {
        key: `${prefixStr}${path.join("-")}`,
        path: `${baseUrl}/${path.join("/")}`,
        name,
        component: lazy(modules[key]),
        exact,
      };

      // isDynamicRoute
      const isDynamicRoute = !!dynamicRouteParams?.length;
      if (isDynamicRoute) {
        templateRoute.path = `${baseUrl}/${path.join(
          "/"
        )}/:${dynamicRouteParams.join("/:")}`;
      }

      if (redirectUri) {
        // 动态路由重定向
        if (isDynamicRoute) {
          const redirectTemplateRoute = {
            key: `redirect-${path.join("-")}`,
            path: `${baseUrl}/${path.join("/")}`,
            name: key,
          };

          const rePath = `${baseUrl}/${path.join("/")}/${redirectUri}`;
          Reflect.set(redirectTemplateRoute, "redirect", rePath);
          set(routeList, "", redirectTemplateRoute);
        } else {
          // Ordinary Route
          const rePath = `${baseUrl}/${path.join("/")}/${redirectUri}`;
          Reflect.set(templateRoute, "redirect", rePath);
        }
      }
      set(routeList, finalPath, templateRoute);
    }
  }

  return serializeRoutes(routeList);
};

export default getRoutes;
