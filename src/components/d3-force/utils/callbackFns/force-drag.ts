import * as d3 from "d3";

const cbDrag = (simulation: d3.Simulation<any, any>) => {
  function dragStarted(
    event: d3.D3DragEvent<d3.DraggedElementBaseType, any, any>
  ) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  const dragged = (
    event: d3.D3DragEvent<d3.DraggedElementBaseType, any, any>
  ) => {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  };

  const dragEnded = (
    event: d3.D3DragEvent<d3.DraggedElementBaseType, any, any>
  ) => {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  };

  return d3
    .drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);
};

export default cbDrag;
