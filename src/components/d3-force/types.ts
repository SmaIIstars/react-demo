import type { INode, ILink } from "./utils/D3Force/types";
import type { SimulationLinkDatum, SimulationNodeDatum, Force } from "d3";

interface IBindEvent {
  targeDom: "svg" | "nodeEls" | "linkEls";
  event: any;
}

interface IOptions {
  forces?: {
    [key: string]: Force<
      SimulationNodeDatum,
      SimulationLinkDatum<SimulationNodeDatum>
    >;
  };
  isDrag?: boolean;
  isZoom?: boolean;
  zoomScale?: [number, number];
  bindEvents?: IBindEvent[];
}

// components
export interface ID3ForceOption {
  [key: string | number | symbol]: any;
  data: {
    nodes: INode[];
    links: ILink[];
  };

  Node?: JSX.Element;
  Link?: JSX.Element;

  children?:
    | {
        Node: JSX.Element;
        Link: JSX.Element;
      }
    | JSX.Element[];

  options?: IOptions;
}
