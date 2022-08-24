import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export interface INode extends SimulationNodeDatum {
  [key: string | number | symbol]: any;
}

export interface ILink extends SimulationLinkDatum<INode> {
  [key: string | number | symbol]: any;
}
