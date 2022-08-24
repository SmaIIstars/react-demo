import * as PIXI from "pixi.js";

import { InteractionEvent } from "pixi.js";

const BunnyUrl = "https://pixijs.io/examples/examples/assets/bunny.png";

export default class BulletproofGlassGame {
  app: PIXI.Application;
  data: any;
  alpha: number = 1;
  dragging: boolean = false;
  sprite: PIXI.Sprite;
  animate: number | undefined;

  constructor(container: HTMLElement, options?: any) {
    this.app = new PIXI.Application({ backgroundColor: 0x1099bb });

    // Scale mode for all textures, will retain pixelation
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.sprite = this.createSprite();
    this.app.stage.addChild(this.sprite);

    this.app.stage.addChild(
      this.createBunny(
        Math.floor(Math.random() * container.clientWidth),
        Math.floor(Math.random() * container.clientHeight)
      )
    );
  }

  animation = () => {
    this.animate = requestAnimationFrame(this.animation);
    this.sprite.rotation += 0.01;
  };

  createSprite = () => {
    const sprite = PIXI.Sprite.from(BunnyUrl);

    // Set the initial position
    sprite.anchor.set(0.5);
    sprite.x = this.app.screen.width / 2;
    sprite.y = this.app.screen.height / 2;

    // Opt-in to interactivity
    sprite.interactive = true;

    // Shows hand cursor
    sprite.buttonMode = true;

    // Pointers normalize touch and mouse
    sprite.on("pointerdown", () => {
      sprite.scale.x *= 1.25;
      sprite.scale.y *= 1.25;
    });

    return sprite;
  };

  createBunny(x: number, y: number) {
    // create a texture from an image path
    // const texture = PIXI.Texture.from(BunnyUrl);

    // // Scale mode for pixelation
    // texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // create our little bunny friend..
    const bunny = PIXI.Sprite.from(BunnyUrl);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);

    // setup events for mouse + touch using
    // the pointer events
    bunny
      .on("pointerdown", (event) => {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        console.error("pointerdown", event);

        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
      })
      .on("pointerup", () => {
        console.error("pointerup");
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
      })
      .on("pointerupoutside", () => {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
      })
      .on("pointermove", (e: InteractionEvent) => {
        if (this.dragging) {
          // console.error("pointermove", e.data.getLocalPosition(bunny));
          const newPosition = e.data.global;
          bunny.x = newPosition.x;
          bunny.y = newPosition.y;
        }
      });

    // For mouse-only events
    // .on('mousedown', onDragStart)
    // .on('mouseup', onDragEnd)
    // .on('mouseupoutside', onDragEnd)
    // .on('mousemove', onDragMove);

    // For touch-only events
    // .on('touchstart', onDragStart)
    // .on('touchend', onDragEnd)
    // .on('touchendoutside', onDragEnd)
    // .on('touchmove', onDragMove);

    // move the sprite to its designated position
    bunny.x = x;
    bunny.y = y;

    return bunny;
  }
}
