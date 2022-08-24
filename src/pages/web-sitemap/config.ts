import { SITE_NAME, SITE_DOMAIN, BLOG, CRON, TYPE } from "./constant";
// import type { TType } from "./constant";

export interface ISitemap {
  name: string;
  uri: string;
  type: TYPE;
}

export interface IConfig {
  siteName: string;
  siteUri: string;
  sitemaps: ISitemap[];
}

const config: IConfig = {
  siteName: `${SITE_NAME}`,
  siteUri: `//${SITE_DOMAIN}`,
  sitemaps: [
    // blog
    {
      name: BLOG.NAME,
      uri: BLOG.URI,
      type: TYPE.APP,
    },

    // cron
    {
      name: CRON.NAME,
      uri: CRON.URI,
      type: TYPE.APP,
    },

    // book
    {
      name: "Professional JavaScript for Web Developers, 4th Edition(zh)",
      uri: `//${SITE_DOMAIN}/JavaScript.pdf`,
      type: TYPE.RESOURCE,
    },
  ],
};

export default config;
