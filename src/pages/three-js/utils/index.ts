import * as THREE from "three";

export const initThree = (rootDom: Element) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    rootDom.parentElement!.clientWidth / rootDom.parentElement!.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: rootDom,
  });

  renderer.setSize(
    rootDom.parentElement!.clientWidth,
    rootDom.parentElement!.clientHeight
  );

  return { scene, camera, renderer };
};
