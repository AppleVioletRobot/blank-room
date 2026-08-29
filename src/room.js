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
  if (materialConfig.textureRepeat) return materialConfig.textureRepeat;

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
    group.add(new THREE.Mesh(geometry.clone(), overlayMaterial));
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

function buildWallGridColumns(layout, architecture) {
  const [itemWidth, itemHeight] = wallGridItemSize(layout);
  const columnGap = layout.columnGap ?? 0.18;
  const rowGap = layout.rowGap ?? 0.18;
  const rows = layout.rows ?? 1;
  const verticalCentre = layout.verticalCentre ?? 1.7;
  const normalOffset = layout.normalOffset ?? 0.02;
  const wallById = new Map(architecture.map((item) => [item.id, item]));
  const wallGroups = [];

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
    const columnGroups = [];

    for (let column = 0; column < columns; column += 1) {
      const columnSlots = [];
      const horizontalOffset = (column - (columns - 1) / 2) * (itemWidth + columnGap);

      for (let row = 0; row < rows; row += 1) {
        const rowCentre = firstRowCentre + row * (itemHeight + rowGap);
        const verticalOffset = rowCentre - wall.position[1];
        const position = wallPosition.clone()
          .add(right.clone().multiplyScalar(horizontalOffset))
          .add(up.clone().multiplyScalar(verticalOffset))
          .add(normal.clone().multiplyScalar(normalOffset));

        columnSlots.push({
          wallId,
          size: [itemWidth, itemHeight],
          position: position.toArray(),
          rotation: [...wall.rotation]
        });
      }

      columnGroups.push(columnSlots);
    }

    wallGroups.push({ wallId, columnGroups });
  }

  return wallGroups;
}

function orderedWallGridSlots(layout, architecture) {
  const wallGroups = buildWallGridColumns(layout, architecture);

  if (layout.distribution !== 'balanced') {
    return wallGroups.flatMap((wall) => wall.columnGroups.flat());
  }

  const slots = [];
  const maxColumns = Math.max(0, ...wallGroups.map((wall) => wall.columnGroups.length));
  for (let columnIndex = 0; columnIndex < maxColumns; columnIndex += 1) {
    for (const wall of wallGroups) {
      const column = wall.columnGroups[columnIndex];
      if (column) slots.push(...column);
    }
  }
  return slots;
}

async function addWallGrid(scene, layout, architecture, materials) {
  if (layout.enabled === false) return;

  const sourceImages = [...(layout.images ?? [])];
  const slots = orderedWallGridSlots(layout, architecture);
  if (sourceImages.length === 0 || slots.length === 0) return;

  const rows = layout.rows ?? 1;
  let requestedCount = layout.itemCount ?? Math.min(sourceImages.length, slots.length);
  requestedCount = Math.min(requestedCount, sourceImages.length, slots.length);
  if (layout.completeColumns && rows > 1) {
    requestedCount = Math.floor(requestedCount / rows) * rows;
  }

  let chosenImages = layout.randomiseSelection
    ? shuffledCopy(sourceImages).slice(0, requestedCount)
    : sourceImages.slice(0, requestedCount);

  if (layout.randomiseOrder) chosenImages = shuffledCopy(chosenImages);

  if (layout.repeatImages && chosenImages.length < slots.length) {
    const repeated = [];
    const repeatCount = layout.itemCount ?? slots.length;
    for (let index = 0; index < repeatCount; index += 1) {
      repeated.push(chosenImages[index % chosenImages.length]);
    }
    chosenImages = repeated;
  }

  const displayCount = Math.min(chosenImages.length, slots.length);
  for (let index = 0; index < displayCount; index += 1) {
    const image = chosenImages[index];
    const slot = slots[index];
    const baseMaterial = materials[layout.material] ?? { baseColor: '#ffffff', textureOpacity: 1 };
    const materialConfig = { ...baseMaterial, texture: image, textureRepeat: null, texturePhysicalSize: null, textureRotation: 0 };
    const item = {
      id: `${layout.id}-${index + 1}`,
      type: 'plane',
      size: slot.size,
      position: slot.position,
      rotation: slot.rotation,
      material: layout.material
    };

    const mesh = await createLayeredMesh(geometryForItem(item), materialConfig, item, { side: THREE.FrontSide });
    mesh.name = item.id;
    mesh.position.set(...item.position);
    mesh.rotation.set(...item.rotation);
    scene.add(mesh);
  }
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function interpretationTexture(panel) {
  const canvas = document.createElement('canvas');
  canvas.width = panel.canvasWidth ?? 1600;
  canvas.height = panel.canvasHeight ?? 1200;
  const ctx = canvas.getContext('2d');
  const background = panel.backgroundColor ?? '#ffffff';
  const textColor = panel.textColor ?? '#111111';
  const padding = panel.padding ?? 120;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (panel.borderWidth) {
    ctx.strokeStyle = panel.borderColor ?? textColor;
    ctx.lineWidth = panel.borderWidth;
    const inset = panel.borderWidth / 2;
    ctx.strokeRect(inset, inset, canvas.width - panel.borderWidth, canvas.height - panel.borderWidth);
  }

  ctx.fillStyle = textColor;
  ctx.textBaseline = 'top';

  let y = padding;
  const contentWidth = canvas.width - padding * 2;

  if (panel.eyebrow) {
    ctx.font = `${panel.eyebrowSize ?? 38}px Arial, Helvetica, sans-serif`;
    ctx.fillText(panel.eyebrow.toUpperCase(), padding, y);
    y += (panel.eyebrowSize ?? 38) * 1.8;
  }

  ctx.font = `700 ${panel.headingSize ?? 88}px Arial, Helvetica, sans-serif`;
  for (const line of wrapText(ctx, panel.heading ?? '', contentWidth)) {
    ctx.fillText(line, padding, y);
    y += (panel.headingSize ?? 88) * 1.05;
  }

  if (panel.subheading) {
    y += 24;
    ctx.font = `italic ${panel.subheadingSize ?? 48}px Arial, Helvetica, sans-serif`;
    for (const line of wrapText(ctx, panel.subheading, contentWidth)) {
      ctx.fillText(line, padding, y);
      y += (panel.subheadingSize ?? 48) * 1.25;
    }
  }

  if (panel.body) {
    y += 48;
    ctx.font = `${panel.bodySize ?? 38}px Arial, Helvetica, sans-serif`;
    for (const line of wrapText(ctx, panel.body, contentWidth)) {
      ctx.fillText(line, padding, y);
      y += (panel.bodySize ?? 38) * (panel.lineHeight ?? 1.45);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

async function addInterpretationPanel(scene, panel, materials) {
  if (panel.enabled === false) return;
  const geometry = new THREE.PlaneGeometry(...panel.size);
  const base = materials[panel.material] ?? { baseColor: panel.backgroundColor ?? '#ffffff' };
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: base.baseColor ?? '#ffffff' })));

  const textMaterial = new THREE.MeshBasicMaterial({
    map: interpretationTexture(panel),
    transparent: false,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1
  });
  group.add(new THREE.Mesh(geometry.clone(), textMaterial));
  group.name = panel.id;
  group.position.set(...panel.position);
  group.rotation.set(...panel.rotation);
  scene.add(group);
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

  for (const item of architecture) await addConfiguredItem(scene, item, materials);
  skinConfig.lighting.forEach((light) => addLight(scene, light));
  for (const object of contentConfig.objects ?? []) await addConfiguredItem(scene, object, materials);
  for (const layout of contentConfig.wallLayouts ?? []) await addWallGrid(scene, layout, architecture, materials);
  for (const panel of contentConfig.interpretationPanels ?? []) await addInterpretationPanel(scene, panel, materials);

  return { width, depth, height };
}
