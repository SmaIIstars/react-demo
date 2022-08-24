import React, { memo } from "react";
import classnames from "classnames";
import { renderRoutes } from "react-router-config";

import Sitemap from "../sitemap";
import styles from "./style.module.less";
import type { RouterConfig } from "@/router";

const SideSitemap: React.FC<{
  routes: RouterConfig[];
  title?: string;
}> = (props) => {
  const { routes, title = "Side Sitemap" } = props;

  return (
    <div
      className={classnames(styles["side-sitemap-wrapper"])}
      id="side-sitemap-wrapper"
    >
      <div
        className={classnames(styles["sitemap-wrapper"])}
        id="sitemap-wrapper"
      >
        <Sitemap title={title} routes={routes}></Sitemap>
      </div>
      <div
        className={classnames(styles["content-wrapper"])}
        id="sitemap-content-wrapper"
      >
        {renderRoutes(routes)}
      </div>
    </div>
  );
};

export default memo(SideSitemap);
