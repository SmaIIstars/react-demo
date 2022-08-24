export type StateProps = {
  initPos: number;
  team: number;
  x: number;
};

export default class State {
  private initPos: number;
  team: number;
  x: number;

  constructor(config?: Partial<StateProps>) {
    this.initPos = config?.initPos ?? 0;
    this.team = 1;
    this.x = this.initPos;
  }
}
