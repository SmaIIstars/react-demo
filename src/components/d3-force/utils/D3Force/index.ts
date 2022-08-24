import * as d3 from "d3";

import type {
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
  Force,
} from "d3";

// simulation
export default class D3Force {
  #simulation: Simulation<any, any> = {} as Simulation<any, any>;

  constructor() {
    this.createSimulation();
  }

  createSimulation(): D3Force {
    this.#simulation = d3.forceSimulation();
    return this;
  }

  addNodes<N>(nodes: (N & SimulationNodeDatum)[]): D3Force {
    this.#simulation?.nodes(nodes);
    return this;
  }

  addLinks<N, L>(links: (L & SimulationLinkDatum<N>)[]): D3Force {
    this.addForce({ link_force: d3.forceLink(links) });
    return this;
  }

  addForce<N, L>(forces: {
    [key: string]: Force<N & SimulationNodeDatum, L & SimulationLinkDatum<N>>;
  }) {
    Object.keys(forces).forEach((k) => {
      this.#simulation?.force(k, Reflect.get(forces, k));
    });
  }

  getSimulation = () => this.#simulation;

  render<N, L>(
    nodes: (N & SimulationNodeDatum)[],
    links: (L & SimulationLinkDatum<N>)[]
  ): D3Force {
    this.addNodes<N>(nodes).addLinks<N, L>(links);
    return this;
  }
}
