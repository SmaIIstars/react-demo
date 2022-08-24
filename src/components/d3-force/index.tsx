import React, {
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  Ref,
} from "react";
import * as d3 from "d3";
import classnames from "classnames";

import D3Force from "./utils/D3Force";
import d3ForceDrag from "./utils/callbackFns/force-drag";
import d3ForceZoom from "./utils/callbackFns/force-zoom";
import { GET_D3_FORCE_DEFAULT_FORCES } from "./constant";
import styles from "./style.module.less";

import DefaultLink from "./components/Link";
import DefaultNode from "./components/Node";

import type { ID3ForceOption } from "./types";
import type { INode, ILink } from "./utils/D3Force/types";

const d3Force = (props: ID3ForceOption, parentRef: Ref<any>) => {
  const { Link, Node, children, data, options = {} } = props;
  const { nodes, links } = data;
  const { forces, isDrag = true, isZoom = true } = options;

  const [isCreatedD3Force, setIsCreatedD3Force] = useState(false);
  const isDrawFinish = useRef(false);
  const d3Force = useRef<D3Force>();
  const svgEls = useRef<any[]>([]);

  const FLink =
      (Array.isArray(children) ? children[0] : children?.Link) ?? Link,
    FNode = (Array.isArray(children) ? children[1] : children?.Node) ?? Node;

  useEffect(() => {
    const d3_force = createD3Force();
    d3Force.current = d3_force;
    setIsCreatedD3Force(true);
  }, [nodes, links]);

  useEffect(() => {
    if (isDrawFinish.current) {
      const svg = d3.select("#d3-force-svg-wrapper"),
        nodeEls = svg.selectAll("#d3-force-g-nodes>*"),
        linkEls = svg.selectAll("#d3-force-g-links>*");

      svgEls.current = [svg, nodeEls, linkEls];

      const _d3_force = d3Force.current as D3Force,
        simulation = _d3_force.getSimulation();
      _d3_force.addForce(
        Object.assign(GET_D3_FORCE_DEFAULT_FORCES({ nodes, links }), forces)
      );

      // bind callback event
      simulation.on("tick", cbTick);
      // bind callback drag event
      isDrag && nodeEls.call(d3ForceDrag(simulation) as any);
      isZoom && svg.call(d3ForceZoom(options.zoomScale) as any);
      bindEvent({ svg, nodeEls, linkEls }, options.bindEvents);
    }
  }, [isCreatedD3Force]);

  // Function
  // Create d3-force instance
  const createD3Force = useCallback(() => {
    const d3_force = new D3Force();

    // bind data to instance
    d3_force.render(nodes, links);
    return d3_force;
  }, [links, nodes]);

  // tick callback Function
  const cbTick = useCallback(() => {
    if (!svgEls.current.length) return void 0;
    const [svg, nodeEls, linkEls] = svgEls.current;

    // node
    nodeEls
      .data(nodes)
      .attr("transform", (d: INode) => `translate(${d.x},${d.y})`);

    // links
    linkEls
      .data(links)
      .attr("x1", (d: ILink) => (d.source as INode).x)
      .attr("y1", (d: ILink) => (d.source as INode).y)
      .attr("x2", (d: ILink) => (d.target as INode).x)
      .attr("y2", (d: ILink) => (d.target as INode).y);
  }, [links, nodes]);

  // bind event
  const bindEvent = (
    doms: Record<
      "svg" | "nodeEls" | "linkEls",
      d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>
    >,
    events: {
      targeDom: "svg" | "nodeEls" | "linkEls";
      event: any;
    }[] = []
  ) => {
    events.forEach((e) => {
      Reflect.get(doms, e.targeDom).call(e.event);
    });
  };

  // get curInstances
  const getInstances = () => ({
    D3Force: d3Force.current,
    simulation: d3Force.current?.getSimulation(),
  });

  // exposed functions to parent
  useImperativeHandle(parentRef, () => {
    //currentDom has a value for the first time, then null
    return {
      currentDom: (parentRef as React.RefObject<any>).current,
      getInstances,
    };
  });

  // JSX
  // Nodes
  const drawNodes = (): JSX.Element => {
    isDrawFinish.current = true;
    return <g id="d3-force-g-nodes">{FNode ?? <DefaultNode data={nodes} />}</g>;
  };
  // Lines
  const drawLines = (): JSX.Element => (
    <g id="d3-force-g-links">{FLink ?? <DefaultLink data={links} />}</g>
  );

  const drawSvg = () => (
    <>
      {drawLines()}
      {drawNodes()}
    </>
  );

  return (
    <>
      <h1>d3-force</h1>

      <div
        className={classnames(styles["d3-force-wrapper"])}
        id="d3-force-wrapper"
        ref={parentRef}
      >
        <svg
          className={classnames(styles["d3-force-svg-wrapper"])}
          id="d3-force-svg-wrapper"
        >
          {isCreatedD3Force && drawSvg()}
        </svg>
      </div>
    </>
  );
};

export default memo(forwardRef(d3Force));
