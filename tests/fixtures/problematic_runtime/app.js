import * as THREE from "three";

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);

function animate() {
  renderer.render();
  requestAnimationFrame(animate);
}

animate();
