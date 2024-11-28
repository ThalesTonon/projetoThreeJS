import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

const loadAvatar = (scene) => {
  const loader = new GLTFLoader();
  const avatarGroup = new THREE.Group();
  let mixer = null;
  let idleAction = null;
  let walkAction = null;
  let currentAction = null;

  loader.load(
    "/adam.glb",
    (gltf) => {
      const avatar = gltf.scene;
      avatar.scale.set(0.5, 0.5, 0.5);
      avatarGroup.add(avatar);
      scene.add(avatarGroup);

      // Configurar animações
      mixer = new THREE.AnimationMixer(avatar);
      idleAction = mixer.clipAction(
        gltf.animations.find((clip) => clip.name === "idle")
      );
      walkAction = mixer.clipAction(
        gltf.animations.find((clip) => clip.name === "walk")
      );

      if (idleAction) {
        currentAction = idleAction;
        idleAction.play();
      }
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log("An error happened");
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

  return { avatarGroup, mixer, switchAnimation, idleAction, walkAction };
};

export default loadAvatar;
