import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import setupScene from "./components/SceneSetup";

const MuseumApp = () => {
  useEffect(() => {
    // Configuração básica
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Configurar a cena com setupScene
    setupScene(scene);

    // Luzes adicionais
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Avatar
    const loader = new GLTFLoader();
    let avatarGroup = new THREE.Group();
    let mixer = null;
    let idleAction = null;
    let walkAction = null;
    let currentAction = null;

    loader.load("/adam.glb", (gltf) => {
      const avatar = gltf.scene;
      avatar.scale.set(1, 1, 1);
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
    });

    // Movimentação do avatar
    const keysPressed = {};
    const direction = new THREE.Vector3();
    const velocity = new THREE.Vector3();

    const switchAnimation = (nextAction) => {
      if (currentAction !== nextAction) {
        if (currentAction) currentAction.fadeOut(0.5);
        currentAction = nextAction;
        if (nextAction) {
          nextAction.reset().fadeIn(0.5).play();
        }
      }
    };

    window.addEventListener("keydown", (event) => {
      keysPressed[event.key.toLowerCase()] = true;
      if (walkAction && (keysPressed["w"] || keysPressed["s"])) {
        switchAnimation(walkAction);
      }
    });

    window.addEventListener("keyup", (event) => {
      keysPressed[event.key.toLowerCase()] = false;
      if (idleAction && !keysPressed["w"] && !keysPressed["s"]) {
        switchAnimation(idleAction);
      }
    });

    const constrainPosition = (position) => {
      const limit = 9; // Limites internos do museu
      position.x = THREE.MathUtils.clamp(position.x, -limit, limit);
      position.z = THREE.MathUtils.clamp(position.z, -limit, limit);
    };

    const updateCamera = () => {
      if (avatarGroup) {
        const avatarPosition = avatarGroup.position;
        const cameraOffset = new THREE.Vector3(0, 2, -3); // Mais próximo do avatar
        const rotatedOffset = cameraOffset
          .clone()
          .applyEuler(new THREE.Euler(0, avatarGroup.rotation.y, 0));
        const targetPosition = avatarPosition.clone().add(rotatedOffset);

        // Ajustar altura para evitar travamentos
        targetPosition.y = Math.max(avatarPosition.y + cameraOffset.y, 1);

        // Evitar que a câmera entre nas paredes
        targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, -8.5, 8.5);
        targetPosition.z = THREE.MathUtils.clamp(targetPosition.z, -8.5, 8.5);

        camera.position.lerp(targetPosition, 0.2); // Movimento suave
        camera.lookAt(avatarPosition.clone().add(new THREE.Vector3(0, 1.5, 0)));
      }
    };

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      if (avatarGroup) {
        direction.set(0, 0, 0);

        if (keysPressed["w"]) direction.z = 0.2; // Reduzida para maior controle
        if (keysPressed["s"]) direction.z = -0.2;
        if (keysPressed["a"]) avatarGroup.rotation.y += delta * 2;
        if (keysPressed["d"]) avatarGroup.rotation.y -= delta * 2;

        direction.applyEuler(avatarGroup.rotation);
        velocity.add(direction.multiplyScalar(delta * 2));
        avatarGroup.position.add(velocity);
        constrainPosition(avatarGroup.position);
        velocity.multiplyScalar(0.9);
      }

      updateCamera();
      renderer.render(scene, camera);
    };

    animate();

    // Ajuste de janela
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; // Não renderiza diretamente no React
};

export default MuseumApp;
