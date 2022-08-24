import { memo, useEffect } from "react";
import * as THREE from "three";
import { initThree } from "../utils";

const LineScene = () => {
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
    camera.position.set(5, 5, 20);
    camera.lookAt(0, 0, 0);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const material = new THREE.LineBasicMaterial({ color: "bisque" });

    const points = [];
    points.push(new THREE.Vector3(0, 0, 10));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    points.push(new THREE.Vector3(0, 0, 10));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    scene.add(line);

    const animate = () => {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };
    animate();
  };

  return (
    <div id="canvas-container" style={{ height: "100%" }}>
      <canvas id="canvas-content"></canvas>
    </div>
  );
};

export default memo(LineScene);
