export const getKeyPathStartPos = (keyPath: string[]) => {
  if (!keyPath || !keyPath.length) return 0;
  const dirName = keyPath.includes("pages") ? "pages" : "views";
  return keyPath.indexOf(dirName);
};

export const routerFilter = (blackRouterList: string[], keyPath: string) => {
  const keyPathArr = keyPath.split("/");
  const fileName = keyPathArr.slice(getKeyPathStartPos(keyPathArr) + 1, -1)[0];
  return blackRouterList.includes(fileName);
};

export const getModules = (blackList: string[] = []) => {
  // .txs files in 'pages' folders
  const modules = import.meta.glob("../../pages/**/*.tsx");
  let res: Record<
    string,
    () => Promise<{
      default: React.ComponentType<any>;
    }>
  > = {};

  if (!modules) return res;

  for (const key in modules) {
    if (!routerFilter(blackList, key) && !key.includes("components")) {
      Reflect.set(res, key, modules[key]);
    }
  }
  return res;
};

export const getComponents = () => {
  const components = import.meta.globEager("../../pages/**/*.tsx");
  let res: Record<string, { [key: string]: any }> = {};
  if (!components) return res;

  for (const key in components) {
    if (!key.includes("components")) {
      Reflect.set(res, key, components[key]);
    }
  }
  return res;
};
