/*
const template = {
  NAME: `${}`,
  URI: `${}`,
}
*/

// site
export const SITE_NAME = "SmallStars";
export const SITE_DOMAIN = "smallstars.top";

// blog
export const BLOG = {
  NAME: `${SITE_NAME}'s Blog`,
  URI: `//blog.${SITE_DOMAIN}`,
};

// cron
export const CRON = {
  NAME: `${SITE_NAME}'s Cron Expression`,
  URI: `//cron.${SITE_DOMAIN}`,
};

export enum TYPE {
  APP = "app",
  POST = "post",
  RESOURCE = "resource",
}
