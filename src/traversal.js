import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

function assetUrl(path) {
  if (!path) return null;
  try {
    return new URL(path, document.baseURI).href;
  } catch {
    return path;
  }
}

async function materialFromConfig(config = {}) {
  let map = null;
  if (config.texture) {
    map = await textureLoader.loadAsync(assetUrl(config.texture));
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    if (config.textureRepeat) map.repeat.set(...config.textureRepeat);
    if (config.textureRotation) {
      map.center.set(0.5, 0.5);
      map.rotation = config.textureRotation;
    }
  }

  return new THREE.MeshStandardMaterial({
    color: config.baseColor ?? '#ffffff',
    map,
    emissive: config.emissiveColor ?? '#000000',
    emissiveIntensity: config.emissiveIntensity ?? 0,
    roughness: config.roughness ?? 1,
    metalness: config.metalness ?? 0
  });
}

function apertureCentreX(def, roomWidth) {
  const sideMargin = def.sideMargin ?? 0.55;
  if (def.aperturePosition === 'left') return -roomWidth / 2 + sideMargin + def.apertureWidth / 2;
  if (def.aperturePosition === 'right') return roomWidth / 2 - sideMargin - def.apertureWidth / 2;
  return 0;
}

async function makeMaterial(materials, id) {
  const config = materials[id];
  if (!config) throw new Error(`Unknown traversal material: ${id}`);
  return materialFromConfig(config);
}

async function addTraversalPlane(scene, def, roomConfig, materials, colliders) {
  const width = roomConfig.dimensions.width;
  const height = roomConfig.dimensions.height;
  const thickness = def.thickness ?? 0.24;
  const apertureWidth = def.apertureWidth ?? 2.2;
  const apertureHeight = def.apertureHeight ?? 2.55;
  const x = apertureCentreX({ ...def, apertureWidth }, width);
  const leftEdge = -width / 2;
  const rightEdge = width / 2;
  const apertureLeft = x - apertureWidth / 2;
  const apertureRight = x + apertureWidth / 2;
  const leftWidth = apertureLeft - leftEdge;
  const rightWidth = rightEdge - apertureRight;
  const topHeight = height - apertureHeight;

  const faceMaterial = await makeMaterial(materials, def.faceMaterial ?? def.material);
  const edgeMaterial = await makeMaterial(materials, def.edgeMaterial ?? def.faceMaterial ?? def.material);
  const boxMaterials = [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, faceMaterial, faceMaterial];

  function block(id, blockX, blockY, blockWidth, blockHeight, collides = true) {
    if (blockWidth <= 0 || blockHeight <= 0) return;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(blockWidth, blockHeight, thickness), boxMaterials);
    mesh.name = `${def.id}-${id}`;
    mesh.position.set(blockX, blockY, def.z);
    scene.add(mesh);

    if (collides) {
      colliders.push({
        id: `${def.id}-${id}`,
        minX: blockX - blockWidth / 2,
        maxX: blockX + blockWidth / 2,
        minZ: def.z - thickness / 2,
        maxZ: def.z + thickness / 2
      });
    }
  }

  block('left', leftEdge + leftWidth / 2, height / 2, leftWidth, height);
  block('right', apertureRight + rightWidth / 2, height / 2, rightWidth, height);
  // The lintel is visible but omitted from the current 2D floor-plan collision model.
  block('top', x, apertureHeight + topHeight / 2, apertureWidth, topHeight, false);
}

export async function addTraversalPlanes(scene, roomConfig, materials) {
  const colliders = [];
  for (const plane of roomConfig.planes ?? []) {
    if (plane.enabled === false) continue;
    await addTraversalPlane(scene, plane, roomConfig, materials, colliders);
  }
  return colliders;
}

function addTextSign(scene, sign) {
  if (sign.enabled === false) return;
  const canvas = document.createElement('canvas');
  canvas.width = sign.canvasWidth ?? 1024;
  canvas.height = sign.canvasHeight ?? 384;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = sign.backgroundColor ?? '#16834a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = sign.textColor ?? '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${sign.fontSize ?? 190}px Arial, Helvetica, sans-serif`;
  ctx.fillText(sign.text ?? '', canvas.width / 2, canvas.height / 2 + 5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...sign.size), material);
  mesh.name = sign.id;
  mesh.position.set(...sign.position);
  mesh.rotation.set(...(sign.rotation ?? [0, 0, 0]));
  scene.add(mesh);
}

export function addTextSigns(scene, contentConfig) {
  for (const sign of contentConfig.signs ?? []) addTextSign(scene, sign);
}
