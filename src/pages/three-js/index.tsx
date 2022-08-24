import { memo, useState, useEffect } from "react";
import SideSitemap from "@/components/side-sitemap";
import WebGL from "./utils/WebGL";

import type { RouterConfig } from "@/router";

const ThreeJs: React.FC<{ route: RouterConfig }> = (props) => {
  const {
    route: { routes: routesConfig },
  } = props;
  const [isWebGlAvailable, setIsWebGlAvailable] = useState<boolean>(false);

  useEffect(() => {
    if (!WebGL.isWebGLAvailable()) {
      document.body.appendChild(WebGL.getWebGLErrorMessage());
    } else if (!WebGL.isWebGL2Available()) {
      document.body.appendChild(WebGL.getWebGL2ErrorMessage());
    } else {
      setIsWebGlAvailable(true);
    }
  }, []);

  return (
    <>
      {isWebGlAvailable && (
        <SideSitemap routes={routesConfig!} title="Three Js"></SideSitemap>
      )}
    </>
  );
};

ThreeJs.exact = false;

export default memo(ThreeJs);
