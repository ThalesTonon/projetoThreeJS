import React, { useEffect } from "react";
import * as THREE from "three";
import setupScene from "./components/SceneSetup";
import addLights from "./components/Lights";
import {
  loadAvatar,
  moveAvatar,
  updateCamera,
} from "./components/AvatarControls";

const App = () => {
  useEffect(() => {
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

    // Configurar a cena e as luzes
    setupScene(scene);
    addLights(scene);

    // Carregar avatar e animações
    const { avatarGroup, mixer, actions, switchAnimation } = loadAvatar(scene);

    const keysPressed = {};
    const clock = new THREE.Clock();

    // Gerenciar teclado
    window.addEventListener("keydown", (event) => {
      keysPressed[event.key.toLowerCase()] = true;
      if (actions.walk && (keysPressed["w"] || keysPressed["s"])) {
        switchAnimation(actions.walk);
      }
    });

    window.addEventListener("keyup", (event) => {
      keysPressed[event.key.toLowerCase()] = false;
      if (actions.idle && !keysPressed["w"] && !keysPressed["s"]) {
        switchAnimation(actions.idle);
      }
    });

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta); // Atualizar animações
      if (avatarGroup) moveAvatar(avatarGroup, keysPressed, delta); // Movimentação
      updateCamera(camera, avatarGroup); // Atualizar câmera

      renderer.render(scene, camera);
    };

    animate();

    // Ajustar para redimensionamento
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default App;
