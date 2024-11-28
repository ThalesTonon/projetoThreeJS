import * as THREE from "three";

const setupScene = (scene) => {
  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load("/textures/floor.jpg");
  // Piso
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Paredes
  const wallTexture = textureLoader.load("/textures/wall.jpg");
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(20, 3, 1),
    wallMaterial
  ); // Altura reduzida para 5
  backWall.position.set(0, 1.5, -10); // Y = 2.5 (metade da altura)
  scene.add(backWall);

  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(20, 3, 1),
    wallMaterial
  );
  frontWall.position.set(0, 1.5, 10);
  scene.add(frontWall);

  const sideWall1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 20),
    wallMaterial
  );
  sideWall1.position.set(-10, 1.5, 0);
  scene.add(sideWall1);

  const sideWall2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3, 20),
    wallMaterial
  );
  sideWall2.position.set(10, 1.5, 0);
  scene.add(sideWall2);

  // Teto
  const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
  const ceilingMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 3; // Ajustar para corresponder à nova altura da parede
  scene.add(ceiling);

  // Pontos de luz no teto
  const addPointLight = (x, z) => {
    const pointLight = new THREE.PointLight(0xffffff, 1, 10); // Cor, intensidade, alcance
    pointLight.position.set(x, 2.5, z); // Altura ajustada abaixo do teto
    scene.add(pointLight);

    // Opcional: adicionar uma esfera para representar a luminária
    const lightSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    lightSphere.position.set(x, 2.5, z); // Abaixo do teto
    scene.add(lightSphere);
  };

  // Adicionar luzes em posições diferentes
  addPointLight(-5, -5); // Luz 1
  addPointLight(5, -5); // Luz 2
  addPointLight(-5, 5); // Luz 3
  addPointLight(5, 5); // Luz 4
};

export default setupScene;
