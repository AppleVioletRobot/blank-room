import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export function createControls(camera, domElement, roomBounds, speed = 3.2) {
  const controls = new PointerLockControls(camera, domElement);
  const keys = new Set();
  const margin = 0.35;

  window.addEventListener('keydown', (event) => keys.add(event.code));
  window.addEventListener('keyup', (event) => keys.delete(event.code));

  function update(delta) {
    if (!controls.isLocked) return;

    let forward = 0;
    let right = 0;

    if (keys.has('KeyW') || keys.has('ArrowUp')) forward += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) forward -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) right += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) right -= 1;

    const length = Math.hypot(forward, right) || 1;
    forward /= length;
    right /= length;

    controls.moveForward(forward * speed * delta);
    controls.moveRight(right * speed * delta);

    camera.position.x = Math.max(-roomBounds.width / 2 + margin, Math.min(roomBounds.width / 2 - margin, camera.position.x));
    camera.position.z = Math.max(-roomBounds.depth / 2 + margin, Math.min(roomBounds.depth / 2 - margin, camera.position.z));
  }

  return { controls, update };
}
