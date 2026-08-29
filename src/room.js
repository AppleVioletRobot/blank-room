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
    const overlayMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      opacity: materialConfig.textureOpacity ?? 1,
      side,
      depthWrite: false
    });
    const overlay = new THREE.Mesh(geometry.clone(), overlayMaterial);
    overlay.scale.multiplyScalar(options.overlayScale ?? 1.001);
    group.add(overlay);
  }

  return group;
}

async function addRoomSurface(scene, geometry, materialConfig, transform, options = {}) {
  const mesh = await createLayeredMesh(geometry, materialConfig, options);
  mesh.position.set(...transform.position);
  mesh.rotation.set(...transform.rotation);
  scene.add(mesh);
}

function geometryForObject(object) {
  if (object.type === 'box') return new THREE.BoxGeometry(...object.size);
  if (object.type === 'plane') return new THREE.PlaneGeometry(...object.size);
  throw new Error(`Unknown object type: ${object.type}`);
}

async function addObject(scene, object, materials) {
  if (!object.enabled) return;
  const materialConfig = materials[object.material];
  if (!materialConfig) throw new Error(`Unknown material: ${object.material}`);

  const mesh = await createLayeredMesh(
    geometryForObject(object),
    materialConfig,
    { side: object.type === 'plane' ? THREE.DoubleSide : THREE.FrontSide }
  );
  mesh.name = object.id;
  mesh.position.set(...object.position);
  mesh.rotation.set(...object.rotation);
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

  await Promise.all([
    addRoomSurface(
      scene,
      new THREE.PlaneGeometry(width, depth),
      materials.floor,
      { position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] }
    ),
    addRoomSurface(
      scene,
      new THREE.PlaneGeometry(width, depth),
      materials.ceiling,
      { position: [0, height, 0], rotation: [Math.PI / 2, 0, 0] },
      { side: THREE.DoubleSide }
    ),
    addRoomSurface(
      scene,
      new THREE.PlaneGeometry(width, height),
      materials.walls,
      { position: [0, height / 2, -depth / 2], rotation: [0, 0, 0] }
    ),
    addRoomSurface(
      scene,
      new THREE.PlaneGeometry(width, height),
      materials.walls,
      { position: [0, height / 2, depth / 2], rotation: [0, Math.PI, 0] }
    ),
    addRoomSurface(
      scene,
      new THREE.PlaneGeometry(depth, height),
      materials.walls,
      { position: [-width / 2, height / 2, 0], rotation: [0, Math.PI / 2, 0] }
    ),
    addRoomSurface(
      scene,
      new THREE.PlaneGeometry(depth, height),
      materials.walls,
      { position: [width / 2, height / 2, 0], rotation: [0, -Math.PI / 2, 0] }
    )
  ]);

  skinConfig.lighting.forEach((light) => addLight(scene, light));

  for (const object of contentConfig.objects) {
    await addObject(scene, object, materials);
  }

  return { width, depth, height };
}
