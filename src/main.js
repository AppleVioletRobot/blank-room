import * as THREE from 'three';
import './styles.css';
import { buildRoom } from './room.js';
import { addLighting } from './lighting.js';
import { createControls } from './controls.js';

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function hexToRgbString(hex) {
  const value = hex.replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value;
  const number = Number.parseInt(normalized, 16);
  return [
    (number >> 16) & 255,
    (number >> 8) & 255,
    number & 255
  ].join(', ');
}

function applyUiConfig(skinConfig) {
  const entry = skinConfig.ui?.entryScreen;
  if (!entry) return;

  const root = document.documentElement.style;
  if (entry.backgroundColor) root.setProperty('--entry-bg-rgb', hexToRgbString(entry.backgroundColor));
  if (entry.backgroundOpacity != null) root.setProperty('--entry-bg-opacity', entry.backgroundOpacity);
  if (entry.cardBackgroundColor) root.setProperty('--entry-card-bg', entry.cardBackgroundColor);
  if (entry.textColor) root.setProperty('--entry-text', entry.textColor);
  if (entry.borderColor) root.setProperty('--entry-border', entry.borderColor);
}

async function start() {
  const overlay = document.querySelector('#overlay');
  const enterButton = document.querySelector('#enter-button');

  enterButton.disabled = true;
  enterButton.textContent = 'Loading room…';

  const [roomConfig, skinConfig, contentConfig] = await Promise.all([
    loadJson('./config/room.json'),
    loadJson('./config/skin.json'),
    loadJson('./config/content.json')
  ]);

  applyUiConfig(skinConfig);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    roomConfig.camera.fov,
    window.innerWidth / window.innerHeight,
    roomConfig.camera.near,
    roomConfig.camera.far
  );
  camera.position.set(...roomConfig.player.start);
  if (roomConfig.player.lookAt) camera.lookAt(...roomConfig.player.lookAt);

  const renderer = new THREE.WebGLRenderer({ antialias: roomConfig.renderer.antialias });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, roomConfig.renderer.maxPixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.querySelector('#app').prepend(renderer.domElement);

  const roomBounds = await buildRoom(scene, roomConfig, skinConfig, contentConfig);
  addLighting(scene, skinConfig.lightingFixtures ?? []);
  const { update } = createControls(camera, roomBounds, roomConfig.player);

  enterButton.textContent = 'Enter Room';
  enterButton.disabled = false;
  enterButton.addEventListener('click', () => overlay.classList.add('hidden'));

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
  document.querySelector('.overlay-card').innerHTML = `<h1>Blank Room could not start</h1><p>${error?.message ?? String(error)}</p>`;
});
