import { memo } from "react";

import type { RouterConfig } from "@/router";

interface IProp {
  routes: RouterConfig[];
  title?: string;
}

const Main: React.FC<IProp> = (prop) => {
  const { title, routes: routesConfig } = prop;

  return (
    <>
      <h1>{title}</h1>
      <ul>
        {routesConfig.map((route) => {
          return (
            <li key={route.key}>
              <a href={route.path}>{route.key}</a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

Main.defaultProps = {
  title: "React Test Project",
};

export default memo(Main);
