import * as d3 from "d3";

const cbZoom = (
  scale: [number, number] = [0.4, 2]
): d3.ZoomBehavior<Element, unknown> =>
  d3
    .zoom()
    .scaleExtent(scale) // 缩放范围
    .on("start", () => {
      d3.select("svg").attr("cursor", "pointer");
    })
    .on("zoom", (event: d3.D3ZoomEvent<any, any>) => {
      d3.select("#d3-force-g-links").attr("transform", event.transform as any);
      d3.select("#d3-force-g-nodes").attr("transform", event.transform as any);
    })
    .on("end", () => {
      d3.select("svg").attr("cursor", "default");
    });

export default cbZoom;
