import { memo, Suspense, useEffect } from "react";
import { renderRoutes } from "react-router-config";
import { BrowserRouter } from "react-router-dom";

import { routes } from "./router";

const App = () => {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Suspense>
  );
};

export default memo(App);
