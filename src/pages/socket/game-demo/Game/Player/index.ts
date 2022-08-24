import { v4 as uuidv4 } from "uuid";
import State, { StateProps } from "../State";

type PlayerProps = {
  id: string;
  delay?: number;
  speed?: number;
  state?: StateProps;
};

export default class Player {
  socketId = "";
  id: string;
  enterRoomTS: number;
  state: State;
  tick: NodeJS.Timer | undefined;
  delay: number;
  speed: number;
  predict: boolean;
  reconciliation: boolean;
  interpolation: boolean;

  constructor(config: Partial<PlayerProps>) {
    this.id = config?.id ?? uuidv4();
    this.enterRoomTS = Date.now();
    this.state = config?.state ? new State(config.state) : new State({});
    this.delay = config?.delay ?? 150;
    this.speed = config?.speed ?? 2;
    this.predict = false;
    this.reconciliation = false;
    this.interpolation = false;
  }
}
