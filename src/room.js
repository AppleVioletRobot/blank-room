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

function textureRepeatFor(materialConfig, item) {
  if (materialConfig.textureRepeat) {
    return materialConfig.textureRepeat;
  }

  if (
    materialConfig.texturePhysicalSize &&
    item.type === 'plane' &&
    Array.isArray(item.size) &&
    item.size.length >= 2
  ) {
    const [textureWidthMetres, textureHeightMetres] = materialConfig.texturePhysicalSize;
    const [surfaceWidthMetres, surfaceHeightMetres] = item.size;

    if (textureWidthMetres > 0 && textureHeightMetres > 0) {
      return [
        surfaceWidthMetres / textureWidthMetres,
        surfaceHeightMetres / textureHeightMetres
      ];
    }
  }

  return null;
}

async function createLayeredMesh(geometry, materialConfig, item, options = {}) {
  const group = new THREE.Group();
  const side = options.side ?? THREE.FrontSide;

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: materialConfig.baseColor,
    side
  });
  group.add(new THREE.Mesh(geometry, baseMaterial));

  if (materialConfig.texture) {
    const texture = await loadTexture(materialConfig.texture);
    const repeat = textureRepeatFor(materialConfig, item);

    if (repeat) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(...repeat);
    }

    if (materialConfig.textureRotation) {
      texture.center.set(0.5, 0.5);
      texture.rotation = materialConfig.textureRotation;
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
    item,
    { side: item.doubleSided ? THREE.DoubleSide : THREE.FrontSide }
  );
  mesh.name = item.id;
  mesh.position.set(...item.position);
  mesh.rotation.set(...item.rotation);
  scene.add(mesh);
}

function shuffledCopy(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function wallGridItemSize(layout) {
  const width = layout.itemWidth;
  if (layout.itemHeight) return [width, layout.itemHeight];

  const [pixelWidth, pixelHeight] = layout.aspectRatio ?? [1, 1];
  return [width, width * (pixelHeight / pixelWidth)];
}

function buildWallGridSlots(layout, architecture) {
  const [itemWidth, itemHeight] = wallGridItemSize(layout);
  const columnGap = layout.columnGap ?? 0.18;
  const rowGap = layout.rowGap ?? 0.18;
  const rows = layout.rows ?? 1;
  const verticalCentre = layout.verticalCentre ?? 1.7;
  const normalOffset = layout.normalOffset ?? 0.02;
  const wallById = new Map(architecture.map((item) => [item.id, item]));
  const slots = [];

  for (const wallId of layout.walls ?? []) {
    const wall = wallById.get(wallId);
    if (!wall || wall.type !== 'plane') continue;

    const wallWidth = wall.size[0];
    const columns = Math.max(0, Math.floor((wallWidth + columnGap) / (itemWidth + columnGap)));
    const rotation = new THREE.Euler(...wall.rotation);
    const right = new THREE.Vector3(1, 0, 0).applyEuler(rotation);
    const up = new THREE.Vector3(0, 1, 0).applyEuler(rotation);
    const normal = new THREE.Vector3(0, 0, 1).applyEuler(rotation);
    const wallPosition = new THREE.Vector3(...wall.position);
    const totalRowsHeight = rows * itemHeight + (rows - 1) * rowGap;
    const firstRowCentre = verticalCentre - totalRowsHeight / 2 + itemHeight / 2;

    for (let row = 0; row < rows; row += 1) {
      const rowCentre = firstRowCentre + row * (itemHeight + rowGap);
      const verticalOffset = rowCentre - wall.position[1];

      for (let column = 0; column < columns; column += 1) {
        const horizontalOffset = (column - (columns - 1) / 2) * (itemWidth + columnGap);
        const position = wallPosition.clone()
          .add(right.clone().multiplyScalar(horizontalOffset))
          .add(up.clone().multiplyScalar(verticalOffset))
          .add(normal.clone().multiplyScalar(normalOffset));

        slots.push({
          wallId,
          size: [itemWidth, itemHeight],
          position: position.toArray(),
          rotation: [...wall.rotation]
        });
      }
    }
  }

  return slots;
}

async function addWallGrid(scene, layout, architecture, materials) {
  if (layout.enabled === false) return;

  const images = layout.randomiseOrder === false ? [...(layout.images ?? [])] : shuffledCopy(layout.images ?? []);
  const slots = buildWallGridSlots(layout, architecture);
  if (images.length === 0 || slots.length === 0) return;

  let chosenImages = images;
  if (layout.randomiseSelection) chosenImages = shuffledCopy(images).slice(0, slots.length);

  for (let index = 0; index < slots.length; index += 1) {
    let image = chosenImages[index];
    if (!image && layout.repeatImages) image = chosenImages[index % chosenImages.length];
    if (!image) break;

    const slot = slots[index];
    const baseMaterial = materials[layout.material] ?? { baseColor: '#ffffff', textureOpacity: 1 };
    const materialConfig = {
      ...baseMaterial,
      texture: image,
      textureRepeat: null,
      texturePhysicalSize: null,
      textureRotation: 0
    };
    const item = {
      id: `${layout.id}-${index + 1}`,
      type: 'plane',
      size: slot.size,
      position: slot.position,
      rotation: slot.rotation,
      material: layout.material
    };

    const mesh = await createLayeredMesh(
      geometryForItem(item),
      materialConfig,
      item,
      { side: THREE.FrontSide }
    );
    mesh.name = item.id;
    mesh.position.set(...item.position);
    mesh.rotation.set(...item.rotation);
    scene.add(mesh);
  }
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
  const architecture = roomConfig.architecture ?? [];

  scene.background = new THREE.Color(skinConfig.background);

  for (const item of architecture) {
    await addConfiguredItem(scene, item, materials);
  }

  skinConfig.lighting.forEach((light) => addLight(scene, light));

  for (const object of contentConfig.objects ?? []) {
    await addConfiguredItem(scene, object, materials);
  }

  for (const layout of contentConfig.wallLayouts ?? []) {
    await addWallGrid(scene, layout, architecture, materials);
  }

  return { width, depth, height };
}
