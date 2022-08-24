import { memo, useState, useEffect } from "react";
import classnames from "classnames";

import { formatTimestamp } from "@/utils/format/time";
import { SECOND_FORMAT } from "@/utils/format/time/constant";
import { TYPE } from "./constant";
import config from "./config";
import styles from "./style.module.less";

import type { ISitemap } from "./config";

const lastUpdateDate = formatTimestamp(
  new Date().getTime() / 1000,
  SECOND_FORMAT
);
const SiteMap = () => {
  const { siteName, siteUri, sitemaps } = config;

  const [data, setData] = useState<Record<TYPE, ISitemap[]>>();

  useEffect(() => {
    setData(
      sitemaps.reduce((pre, cur) => {
        if (!Reflect.get(pre, cur.type)) {
          Reflect.set(pre, cur.type, [cur]);
        } else {
          pre[cur.type].push(cur);
        }
        return pre;
      }, {} as Record<TYPE, ISitemap[]>)
    );
  }, [sitemaps]);

  return (
    <div id="sitemap-wrapper" className={classnames(styles["sitemap-wrapper"])}>
      <header>
        <h2>{siteName}'s Website Sitemap</h2>
      </header>

      <div
        id="sitemap-body-wrapper"
        className={classnames(styles["sitemap-body-wrapper"])}
      >
        {data &&
          Object.keys(data).map((type) => {
            return (
              <div className={styles["sitemap-item-wrapper"]} key={type}>
                <h3>{type}</h3>
                <ul>
                  {data[type as TYPE].map((siteItem) => {
                    return (
                      <li key={siteItem.name}>
                        <a href={siteItem.uri}>{siteItem.name}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </div>
      <footer>
        <div className={classnames(styles["latest-update-date"])}>
          Latest Update: {lastUpdateDate}
        </div>
        <div className={classnames(styles["copyright"])}>
          © 2020-2022 {siteName}'s website. All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default memo(SiteMap);
