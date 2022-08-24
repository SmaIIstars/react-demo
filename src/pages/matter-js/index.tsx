import React, { memo, useEffect, useRef, useState } from "react";
import { Bodies, World } from "matter-js";
import BulletproofGlassGame from "./scene";

const BulletproofGlass = () => {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [gameScene, setGameScene] = useState<BulletproofGlassGame>();

  const mouseClickHandle = (e: PointerEvent) => {
    const point = {
      x: e.offsetX,
      y: e.offsetY,
    };

    let circle = createCircle(point);
    World.add(gameScene!.engine.world, circle);
  };

  const createCircle = (point: { x: number; y: number }, r = 20) => {
    const _circle = Bodies.circle(point.x, point.y, r, {
      isStatic: false,
    });

    /** 弹性-衰减  */
    _circle.restitution = 0.8;
    /** 物体质量 */
    _circle.mass = 0.1;

    return _circle;
  };

  useEffect(() => {
    if (document.querySelectorAll("#game-canvas>*").length < 1) {
      const gameScene = new BulletproofGlassGame(
        document.querySelector("#game-canvas")!
      );

      setGameScene(gameScene);
    }
  }, []);
  canvasContainer.current?.addEventListener(
    "click",
    mouseClickHandle as EventListener
  );

  return (
    <div
      id="canvas-container"
      style={{ height: "100%", overflow: "hidden" }}
      ref={canvasContainer}
    >
      <div id="game-canvas"></div>
    </div>
  );
};

export default memo(BulletproofGlass);
