import React, { memo, useEffect, useRef, useState } from "react";
import BulletproofGlassGame from "./scene";

const BulletproofGlass = () => {
  const canvasContainer = useRef<HTMLDivElement>(null);
  const [gameScene, setGameScene] = useState<BulletproofGlassGame>();

  useEffect(() => {
    if (document.querySelectorAll("#game-canvas>*").length < 1) {
      const container = document.querySelector("#game-canvas") as HTMLElement;
      const gameScene = new BulletproofGlassGame(container);

      setGameScene(gameScene);

      container.appendChild(gameScene.app.view);
    }
  }, []);
  // canvasContainer.current?.addEventListener(
  //   "click",
  //   mouseClickHandle as EventListener
  // );

  return (
    <div
      id="canvas-container"
      style={{ height: "100%", overflow: "hidden" }}
      ref={canvasContainer}
    >
      <div>
        <button
          onClick={() => {
            gameScene?.animation();
          }}
        >
          开始
        </button>
        <button
          onClick={() => {
            cancelAnimationFrame(gameScene!.animate!);
          }}
        >
          停止
        </button>
      </div>
      <div id="game-canvas"></div>
    </div>
  );
};

export default memo(BulletproofGlass);
