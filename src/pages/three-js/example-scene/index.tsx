import { memo, useEffect, useState } from "react";
import * as THREE from "three";

import { initThree } from "../utils";

const ExampleScene = () => {
  useEffect(() => {
    let canvasRootDom = document.querySelector("#canvas-content");
    const { scene, camera, renderer } = initThree(canvasRootDom!);

    initScene(scene, camera, renderer);
  }, []);

  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    // Axes helper
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const groupCubes = initObject(scene);
    scene.add(groupCubes);

    // Camera
    camera.position.set(0, 0, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    tick(scene, camera, renderer, groupCubes);
    // renderer.render(scene, camera);
  };

  // Animation
  const clock = new THREE.Clock();
  const tick = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    group: THREE.Group
  ) => {
    // const now = clock.getDelta();
    const now = clock.getElapsedTime() % (Math.PI * 2);

    const [cube1, cube2, cube3] = group.children;
    cube1.rotation.x = now * Math.PI * 2;
    cube2.rotation.y = now * Math.PI * 2;
    cube3.rotation.z = now * Math.PI * 2;

    window.requestAnimationFrame(() => tick(scene, camera, renderer, group));

    renderer.render(scene, camera);
  };

  const initObject = (scene: THREE.Scene) => {
    const group = new THREE.Group();

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    cube1.position.set(-4, 0, 0);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );

    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0x0000ff })
    );
    cube3.position.set(4, 0, 0);

    group.add(cube1, cube2, cube3);

    return group;
  };

  return (
    <div id="canvas-container" style={{ height: "100%" }}>
      <canvas id="canvas-content"></canvas>
    </div>
  );
};

export default memo(ExampleScene);
