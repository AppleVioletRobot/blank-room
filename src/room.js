import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

function assetUrl(path) {
  return new URL(path, document.baseURI).href;
}

async function loadTexture(path) {
  if (!path) return null;
  const texture = await textureLoader.loadAsync(assetUrl(path));
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

async function createLayeredMesh(geometry, materialConfig, options = {}) {
  const group = new THREE.Group();
  const side = options.side ?? THREE.FrontSide;

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: materialConfig.baseColor,
    side
  });
  group.add(new THREE.Mesh(geometry, baseMaterial));

  if (materialConfig.texture) {
    const texture = await loadTexture(materialConfig.texture);
    if (materialConfig.textureRepeat) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(...materialConfig.textureRepeat);
    }
    const overlayMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: materialConfig.textureOpacity ?? 1,
      side,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const overlay = new THREE.Mesh(geometry.clone(), overlayMaterial);
    group.add(overlay);
  }

  return group;
}

function geometryForItem(item) {
  if (item.type === 'box') return new THREE.BoxGeometry(...item.size);
  if (item.type === 'plane') return new THREE.PlaneGeometry(...item.size);
  throw new Error(`Unknown geometry type: ${item.type}`);
}

async function addConfiguredItem(scene, item, materials) {
  if (item.enabled === false) return;
  const materialConfig = materials[item.material];
  if (!materialConfig) throw new Error(`Unknown material: ${item.material}`);

  const mesh = await createLayeredMesh(
    geometryForItem(item),
    materialConfig,
    { side: item.doubleSided ? THREE.DoubleSide : THREE.FrontSide }
  );
  mesh.name = item.id;
  mesh.position.set(...item.position);
  mesh.rotation.set(...item.rotation);
  scene.add(mesh);
}

function addLight(scene, lightConfig) {
  let light;
  if (lightConfig.type === 'ambient') {
    light = new THREE.AmbientLight(lightConfig.color, lightConfig.intensity);
  } else if (lightConfig.type === 'directional') {
    light = new THREE.DirectionalLight(lightConfig.color, lightConfig.intensity);
    light.position.set(...lightConfig.position);
  } else {
    throw new Error(`Unknown light type: ${lightConfig.type}`);
  }
  scene.add(light);
}

export async function buildRoom(scene, roomConfig, skinConfig, contentConfig) {
  const { width, depth, height } = roomConfig.dimensions;
  const materials = skinConfig.materials;

  scene.background = new THREE.Color(skinConfig.background);

  for (const item of roomConfig.architecture ?? []) {
    await addConfiguredItem(scene, item, materials);
  }

  skinConfig.lighting.forEach((light) => addLight(scene, light));

  for (const object of contentConfig.objects) {
    await addConfiguredItem(scene, object, materials);
  }

  return { width, depth, height };
}
