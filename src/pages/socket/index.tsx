import { memo } from "react";
import SideSitemap from "@/components/side-sitemap";
import type { RouterConfig } from "@/router";

const Socket: React.FC<{ route: RouterConfig }> = (props) => {
  const {
    route: { routes: routesConfig },
  } = props;

  return <SideSitemap routes={routesConfig!} title="Socket"></SideSitemap>;
};

Socket.exact = false;

export default memo(Socket);
