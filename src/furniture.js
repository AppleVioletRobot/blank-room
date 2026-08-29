import * as THREE from 'three';

function materialFor(materials, key, fallback = '#8a6a4a') {
  const config = materials[key] ?? { baseColor: fallback };
  return new THREE.MeshStandardMaterial({ color: config.baseColor ?? fallback });
}

function addBox(group, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  group.add(mesh);
}

function addDiningTable(scene, config, materials) {
  if (config.enabled === false) return;

  const width = config.width ?? 2.4;
  const depth = config.depth ?? 1.0;
  const height = config.height ?? 0.76;
  const topThickness = config.topThickness ?? 0.07;
  const legSize = config.legSize ?? 0.08;
  const legInset = config.legInset ?? 0.12;
  const topMaterial = materialFor(materials, config.topMaterial ?? config.material);
  const legMaterial = materialFor(materials, config.legMaterial ?? config.material);
  const group = new THREE.Group();

  addBox(group, [width, topThickness, depth], [0, height - topThickness / 2, 0], topMaterial);

  const legHeight = height - topThickness;
  const legY = legHeight / 2;
  const x = width / 2 - legInset - legSize / 2;
  const z = depth / 2 - legInset - legSize / 2;
  for (const [legX, legZ] of [[-x, -z], [x, -z], [-x, z], [x, z]]) {
    addBox(group, [legSize, legHeight, legSize], [legX, legY, legZ], legMaterial);
  }

  group.name = config.id;
  group.position.set(...(config.position ?? [0, 0, 0]));
  group.rotation.set(...(config.rotation ?? [0, 0, 0]));
  scene.add(group);
}

function addWallTable(scene, config, materials) {
  if (config.enabled === false) return;

  const width = config.width ?? 2.4;
  const depth = config.depth ?? 0.5;
  const height = config.height ?? 0.76;
  const topThickness = config.topThickness ?? 0.07;
  const legSize = config.legSize ?? 0.08;
  const legInset = config.legInset ?? 0.12;
  const topMaterial = materialFor(materials, config.topMaterial ?? config.material);
  const legMaterial = materialFor(materials, config.legMaterial ?? config.material);
  const group = new THREE.Group();

  addBox(group, [width, topThickness, depth], [0, height - topThickness / 2, 0], topMaterial);

  const legHeight = height - topThickness;
  const legY = legHeight / 2;
  const x = width / 2 - legInset - legSize / 2;
  const z = depth / 2 - legInset - legSize / 2;
  for (const legX of [-x, x]) {
    addBox(group, [legSize, legHeight, legSize], [legX, legY, z], legMaterial);
  }

  group.name = config.id;
  group.position.set(...(config.position ?? [0, 0, 0]));
  group.rotation.set(...(config.rotation ?? [0, 0, 0]));
  scene.add(group);
}

export function addFurniture(scene, furniture = [], materials = {}) {
  for (const config of furniture) {
    if (config.type === 'dining-table') addDiningTable(scene, config, materials);
    else if (config.type === 'wall-table') addWallTable(scene, config, materials);
    else console.warn(`Unknown furniture type: ${config.type}`);
  }
}
