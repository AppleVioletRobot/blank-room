import * as THREE from 'three';

export function buildRoom(scene, roomConfig, skinConfig, contentConfig) {
  const { width, depth, height } = roomConfig.dimensions;

  scene.background = new THREE.Color(skinConfig.background);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: skinConfig.surfaces.walls });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: skinConfig.surfaces.floor });
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: skinConfig.surfaces.ceiling, side: THREE.DoubleSide });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = height;
  scene.add(ceiling);

  const back = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMaterial);
  back.position.set(0, height / 2, -depth / 2);
  scene.add(back);

  const front = back.clone();
  front.rotation.y = Math.PI;
  front.position.z = depth / 2;
  scene.add(front);

  const sideGeometry = new THREE.PlaneGeometry(depth, height);
  const left = new THREE.Mesh(sideGeometry, wallMaterial);
  left.rotation.y = Math.PI / 2;
  left.position.set(-width / 2, height / 2, 0);
  scene.add(left);

  const right = left.clone();
  right.rotation.y = -Math.PI / 2;
  right.position.x = width / 2;
  scene.add(right);

  const ambient = new THREE.AmbientLight(skinConfig.lighting.ambientColor, skinConfig.lighting.ambientIntensity);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(skinConfig.lighting.keyColor, skinConfig.lighting.keyIntensity);
  key.position.set(2, height - 0.5, 1);
  scene.add(key);

  if (contentConfig.plinth?.enabled) {
    const p = contentConfig.plinth;
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(p.size[0], p.size[1], p.size[2]),
      new THREE.MeshStandardMaterial({ color: skinConfig.objects.plinth })
    );
    plinth.position.set(...p.position);
    scene.add(plinth);
  }

  if (contentConfig.panel?.enabled) {
    const p = contentConfig.panel;
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(p.size[0], p.size[1]),
      new THREE.MeshStandardMaterial({ color: skinConfig.objects.panel })
    );
    panel.position.set(...p.position);
    panel.rotation.set(...p.rotation);
    scene.add(panel);
  }

  return { width, depth, height };
}
