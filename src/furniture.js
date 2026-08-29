import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

function assetUrl(path) {
  return new URL(path, document.baseURI).href;
}

async function materialFor(materials, key, fallback = '#8a6a4a') {
  const config = materials[key] ?? { baseColor: fallback };
  const options = {
    color: config.baseColor ?? fallback,
    transparent: config.transparent === true,
    opacity: config.opacity ?? 1
  };

  if (config.texture) {
    const texture = await textureLoader.loadAsync(assetUrl(config.texture));
    texture.colorSpace = THREE.SRGBColorSpace;

    if (config.textureRepeat) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(...config.textureRepeat);
    }

    if (config.textureRotation) {
      texture.center.set(0.5, 0.5);
      texture.rotation = config.textureRotation;
    }

    options.map = texture;
    options.transparent = true;
    options.opacity = config.textureOpacity ?? options.opacity;
  }

  return new THREE.MeshStandardMaterial(options);
}

function addBox(group, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  group.add(mesh);
}

async function addDiningTable(scene, config, materials) {
  if (config.enabled === false) return;

  const width = config.width ?? 2.4;
  const depth = config.depth ?? 1.0;
  const height = config.height ?? 0.76;
  const topThickness = config.topThickness ?? 0.07;
  const legSize = config.legSize ?? 0.08;
  const legInset = config.legInset ?? 0.12;
  const [topMaterial, legMaterial] = await Promise.all([
    materialFor(materials, config.topMaterial ?? config.material),
    materialFor(materials, config.legMaterial ?? config.material)
  ]);
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

async function addWallTable(scene, config, materials) {
  if (config.enabled === false) return;

  const width = config.width ?? 2.4;
  const depth = config.depth ?? 0.5;
  const height = config.height ?? 0.76;
  const topThickness = config.topThickness ?? 0.07;
  const legSize = config.legSize ?? 0.08;
  const legInset = config.legInset ?? 0.12;
  const [topMaterial, legMaterial] = await Promise.all([
    materialFor(materials, config.topMaterial ?? config.material),
    materialFor(materials, config.legMaterial ?? config.material)
  ]);
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

export async function addFurniture(scene, furniture = [], materials = {}) {
  for (const config of furniture) {
    if (config.type === 'dining-table') await addDiningTable(scene, config, materials);
    else if (config.type === 'wall-table') await addWallTable(scene, config, materials);
    else console.warn(`Unknown furniture type: ${config.type}`);
  }
}
