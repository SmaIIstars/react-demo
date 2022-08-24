import { memo } from "react";
import SiteMap from "@/components/sitemap";
import getRoutes from "@/utils/getAutoRoutes";

const Main = () => {
  const routes = getRoutes(["main"]);

  return <SiteMap routes={routes}></SiteMap>;
};

export default memo(Main);
