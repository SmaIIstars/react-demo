import * as d3 from "d3";

import { INode, ILink } from "./utils/D3Force/types";

// async
export const GET_D3_FORCE_DEFAULT_FORCES = (data: {
  nodes: INode[];
  links: ILink[];
}) => {
  const { links, nodes } = data;

  return {
    charge_force: d3.forceManyBody().strength(-200),
    link_force: d3.forceLink(links).distance(60),
  };
};
