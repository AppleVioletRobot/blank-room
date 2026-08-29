import * as THREE from 'three';

function linspace(start, end, count) {
  if (count <= 1) return [(start + end) / 2];
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, index) => start + index * step);
}

function addRecessedFixture(scene, config, position, index) {
  const radius = config.radius ?? 0.075;
  const trimWidth = config.trimWidth ?? 0.018;
  const ceilingY = position[1];
  const trimColor = config.trimColor ?? '#e8e6df';
  const lampColor = config.lampColor ?? '#fff7e8';
  const lightColor = config.lightColor ?? '#fff3d6';

  const group = new THREE.Group();
  group.name = `${config.id ?? 'recessed-light'}-${index + 1}`;
  group.position.set(...position);
  group.rotation.x = Math.PI / 2;

  const trim = new THREE.Mesh(
    new THREE.RingGeometry(radius, radius + trimWidth, 32),
    new THREE.MeshStandardMaterial({ color: trimColor, side: THREE.DoubleSide })
  );
  group.add(trim);

  const lamp = new THREE.Mesh(
    new THREE.CircleGeometry(radius * 0.82, 32),
    new THREE.MeshBasicMaterial({ color: lampColor, side: THREE.DoubleSide })
  );
  lamp.position.z = 0.001;
  group.add(lamp);
  scene.add(group);

  const light = new THREE.SpotLight(
    lightColor,
    config.intensity ?? 18,
    config.distance ?? 5,
    config.angle ?? Math.PI / 4,
    config.penumbra ?? 0.65,
    config.decay ?? 2
  );
  light.position.set(position[0], ceilingY - 0.03, position[2]);

  const target = new THREE.Object3D();
  target.position.set(position[0], config.targetY ?? 0.9, position[2]);
  scene.add(target);
  light.target = target;
  scene.add(light);
}

function addRecessedGrid(scene, config) {
  const rows = config.rows ?? 2;
  const columns = config.columns ?? 4;
  const xPositions = linspace(-(config.xSpan ?? 4) / 2, (config.xSpan ?? 4) / 2, rows);
  const zPositions = linspace(-(config.zSpan ?? 6) / 2, (config.zSpan ?? 6) / 2, columns);
  const y = config.y ?? 3.38;

  let index = 0;
  for (const x of xPositions) {
    for (const z of zPositions) {
      addRecessedFixture(scene, config, [x, y, z], index);
      index += 1;
    }
  }
}

function addAmbient(scene, config) {
  scene.add(new THREE.AmbientLight(config.color, config.intensity));
}

function addDirectional(scene, config) {
  const light = new THREE.DirectionalLight(config.color, config.intensity);
  light.position.set(...config.position);
  scene.add(light);
}

export function addLighting(scene, lighting = []) {
  for (const config of lighting) {
    if (config.enabled === false) continue;
    if (config.type === 'ambient') addAmbient(scene, config);
    else if (config.type === 'directional') addDirectional(scene, config);
    else if (config.type === 'recessedGrid') addRecessedGrid(scene, config);
    else throw new Error(`Unknown light type: ${config.type}`);
  }
}
