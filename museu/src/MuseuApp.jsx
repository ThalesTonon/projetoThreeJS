import React, { useEffect } from "react";
import * as THREE from "three";
import setupScene from "./components/SceneSetup";
import { loadAvatar } from "./components/loadAvatar";
import { updateCamera } from "./components/updateCamera";
import { setupControls } from "./components/Controls";

const MuseumApp = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    // Configuração da câmera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Configurar cena
    setupScene(scene);

    // Adicionar luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Configurar avatar
    const { avatarGroup, mixer, idleAction, walkAction } = loadAvatar(scene);

    // Configurar controles
    const keysPressed = {};
    setupControls(keysPressed);

    // Controle de movimentação
    const direction = new THREE.Vector3();
    const velocity = new THREE.Vector3();

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      if (avatarGroup) {
        // Movimentação do avatar
        direction.set(0, 0, 0);

        if (keysPressed["w"]) direction.z = 0.2;
        if (keysPressed["s"]) direction.z = -0.2;
        if (keysPressed["a"]) avatarGroup.rotation.y += delta * 2;
        if (keysPressed["d"]) avatarGroup.rotation.y -= delta * 2;

        direction.applyEuler(avatarGroup.rotation);
        velocity.add(direction.multiplyScalar(delta * 2));
        avatarGroup.position.add(velocity);
        velocity.multiplyScalar(0.9); // Desaceleração

        // Atualizar câmera
        updateCamera(camera, avatarGroup);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Responsividade
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; // Não renderiza diretamente
};

export default MuseumApp;
