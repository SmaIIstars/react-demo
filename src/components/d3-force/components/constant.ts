// default component config
import * as d3 from "d3";
export const DEFAULT_COLORS = d3.scaleOrdinal(d3.schemeCategory10);

export const DEFAULT_LINK = {
  CForeignObject: {
    width: 32,
    height: 32,
  },
};

export const DEFAULT_NODE = {
  CCircle: { r: 15 },
};
