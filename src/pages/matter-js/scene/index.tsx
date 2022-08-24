import { Engine, Render, Runner, Bodies, Composite } from "matter-js";

export default class BulletproofGlassGame {
  engine: Engine;
  render: Render;
  runner: Runner;

  constructor(container: HTMLElement, options?: any) {
    this.engine = Engine.create();

    this.render = Render.create({
      element: container,
      engine: this.engine,
    });

    // create runner
    this.runner = Runner.create();

    this.initGame();
    // run the renderer
    Render.run(this.render);

    // run the engine
    Runner.run(this.runner, this.engine);
  }

  initGame = () => {
    // create two boxes and a ground
    let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(this.engine.world, [ground]);
    this.engine.gravity.y = 1;
  };
}
