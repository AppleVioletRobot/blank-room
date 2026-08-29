import * as THREE from 'three';
import './styles.css';
import { buildRoom } from './room.js';
import { createControls } from './controls.js';

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

async function start() {
  const [roomConfig, skinConfig, contentConfig] = await Promise.all([
    loadJson('./config/room.json'),
    loadJson('./config/skin.json'),
    loadJson('./config/content.json')
  ]);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    roomConfig.camera.fov,
    window.innerWidth / window.innerHeight,
    roomConfig.camera.near,
    roomConfig.camera.far
  );
  camera.position.set(...roomConfig.player.start);

  const renderer = new THREE.WebGLRenderer({ antialias: roomConfig.renderer.antialias });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, roomConfig.renderer.maxPixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.querySelector('#app').prepend(renderer.domElement);

  const roomBounds = await buildRoom(scene, roomConfig, skinConfig, contentConfig);
  const { controls, update } = createControls(camera, renderer.domElement, roomBounds, roomConfig.player);

  const overlay = document.querySelector('#overlay');
  const enterButton = document.querySelector('#enter-button');
  enterButton.addEventListener('click', () => controls.lock());
  controls.addEventListener('lock', () => overlay.classList.add('hidden'));
  controls.addEventListener('unlock', () => overlay.classList.remove('hidden'));

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    update(Math.min(clock.getDelta(), roomConfig.renderer.maxDelta));
    renderer.render(scene, camera);
  });
}

start().catch((error) => {
  console.error(error);
  document.querySelector('.overlay-card').innerHTML = `<h1>Blank Room could not start</h1><p>${error.message}</p>`;
});
