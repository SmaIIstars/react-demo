import { memo, useRef, useEffect, useState, Component } from "react";

import D3Force from "@/components/d3-force";
import { nodes, links } from "@/mock/d3-force";
import * as d3 from "d3";

const D3ForceP = () => {
  const d3ForceRef = useRef<any>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const { currentDom } = d3ForceRef.current;

    setWidth((currentDom?.clientWidth ?? 0) / 2);
    setHeight((currentDom?.clientHeight ?? 0) / 2);
  }, []);

  return (
    <D3Force
      ref={d3ForceRef}
      data={{ nodes, links }}
      options={{
        forces: {
          center_force: d3.forceCenter(width, height),
        },
      }}
    ></D3Force>
  );
};
export default memo(D3ForceP);
