const formatBaseUrl = (base: string) => {
  return `/${base.replace("/", "")}`;
};

export const prefixStr = "";
export const subRoutesKey = "routes";
export const baseUrl = formatBaseUrl("/demo");
