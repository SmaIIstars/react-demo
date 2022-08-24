import React, { lazy } from "react";
import { Redirect, RouteProps } from "react-router-dom";
import getRoutes from "@/utils/getAutoRoutes";

// meta Type
interface MetaProps {
  title?: string;
}

const blackRouterList: string[] = [
  // "test",
];

// router type
export type RouterConfig = RouteProps & {
  path: string;
  component?: React.ComponentType<any>;
  routes?: RouterConfig[];
  meta?: MetaProps;
  redirect?: string;
  exact?: boolean;
  key?: string;
  [key: string]: any;
};

const routes = [
  ...getRoutes(blackRouterList),
  {
    path: "*",
    render: () => <Redirect to="/demo/main" />,
  },
];

console.log("routes", routes);

export { routes };
