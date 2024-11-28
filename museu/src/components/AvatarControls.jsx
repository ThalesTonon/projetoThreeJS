import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const loadAvatar = (scene) => {
  const loader = new GLTFLoader();
  const avatarGroup = new THREE.Group();
  let mixer = null;
  let actions = { idle: null, walk: null };
  let currentAction = null;

  loader.load(
    "/adam.glb",
    (gltf) => {
      const avatar = gltf.scene;
      avatar.scale.set(1, 1, 1);
      avatarGroup.add(avatar);
      scene.add(avatarGroup);

      // Configurar animações
      mixer = new THREE.AnimationMixer(avatar);
      gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        if (clip.name.toLowerCase() === "idle") actions.idle = action;
        if (clip.name.toLowerCase() === "walk") actions.walk = action;
      });

      if (actions.idle) {
        currentAction = actions.idle;
        currentAction.play();
      }
    },
    undefined,
    (error) => {
      console.error("Erro ao carregar o avatar:", error);
    }
  );

  const switchAnimation = (nextAction) => {
    if (currentAction !== nextAction) {
      if (currentAction) currentAction.fadeOut(0.5);
      currentAction = nextAction;
      if (nextAction) {
        nextAction.reset().fadeIn(0.5).play();
      }
    }
  };

  return { avatarGroup, mixer, actions, switchAnimation };
};

export const moveAvatar = (avatarGroup, keysPressed, delta) => {
  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();

  if (keysPressed["w"]) direction.z = 0.2;
  if (keysPressed["s"]) direction.z = -0.2;
  if (keysPressed["a"]) avatarGroup.rotation.y += delta * 2;
  if (keysPressed["d"]) avatarGroup.rotation.y -= delta * 2;

  direction.applyEuler(avatarGroup.rotation);
  velocity.add(direction.multiplyScalar(delta * 2));
  avatarGroup.position.add(velocity);
  constrainPosition(avatarGroup.position);
  velocity.multiplyScalar(0.9);
};

const constrainPosition = (position) => {
  const limit = 9; // Limites internos do museu
  position.x = THREE.MathUtils.clamp(position.x, -limit, limit);
  position.z = THREE.MathUtils.clamp(position.z, -limit, limit);
};

export const updateCamera = (camera, avatarGroup) => {
  if (avatarGroup) {
    const avatarPosition = avatarGroup.position;
    const cameraOffset = new THREE.Vector3(0, 2, -3);
    const rotatedOffset = cameraOffset
      .clone()
      .applyEuler(new THREE.Euler(0, avatarGroup.rotation.y, 0));
    const targetPosition = avatarPosition.clone().add(rotatedOffset);

    targetPosition.y = Math.max(avatarPosition.y + cameraOffset.y, 1);

    camera.position.lerp(targetPosition, 0.2);
    camera.lookAt(avatarPosition.clone().add(new THREE.Vector3(0, 1.5, 0)));
  }
};
