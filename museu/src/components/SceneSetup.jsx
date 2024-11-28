import * as THREE from "three";

const addLuminaria = (x, y, z, scene) => {
  // Criar o círculo da luminária no teto
  const circle = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 32), // Luminária em formato de círculo
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff, // Emitir luz visível
      emissiveIntensity: 0.6, // Intensidade da emissão
      side: THREE.DoubleSide, // Visível de ambos os lados
    })
  );
  circle.rotation.x = Math.PI / 2; // Orientar paralelamente ao teto
  circle.position.set(x, y, z);

  // Adicionar luz pontual à luminária
  const pointLight = new THREE.PointLight(0xffe6b8, 1, 10); // Luz amarelada
  pointLight.position.set(x, y - 0.2, z); // Posicionar ligeiramente abaixo da luminária

  scene.add(circle, pointLight);
};

const setupScene = (scene) => {
  const textureLoader = new THREE.TextureLoader();

  // Piso
  const floorTexture = textureLoader.load("/textures/floor.jpg");
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 4);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.8,
      metalness: 0.1,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Paredes
  const wallTexture = textureLoader.load("/textures/wall.jpg");
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.6,
    metalness: 0.1,
  });

  const walls = [
    { position: [0, 1.5, -10], size: [20, 3, 1] },
    { position: [0, 1.5, 10], size: [20, 3, 1] },
    { position: [-10, 1.5, 0], size: [1, 3, 20] },
    { position: [10, 1.5, 0], size: [1, 3, 20] },
  ];

  walls.forEach(({ position, size }) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(...size), wallMaterial);
    wall.position.set(...position);
    scene.add(wall);
  });

  // Teto
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.9,
    metalness: 0.05,
  });
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    ceilingMaterial
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 3;
  scene.add(ceiling);

  // Luminárias no teto
  const luminariaPositions = [
    [-5, 2.98, -5],
    [5, 2.98, -5],
    [-5, 2.98, 5],
    [5, 2.98, 5],
  ];
  luminariaPositions.forEach(([x, y, z]) => addLuminaria(x, y, z, scene));

  // Luz direcional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Luz ambiente
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Reduzida para não ofuscar as luzes pontuais
  scene.add(ambientLight);
};

export default setupScene;
