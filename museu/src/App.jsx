import React, { useState, useEffect } from "react";
import * as THREE from "three";
import setupScene from "./components/SceneSetup";
import loadAvatar from "./components/Avatar";
import updateCamera from "./components/Camera";
import { setupControls, moveAvatar } from "./components/Controls";

const App = () => {
  const [loading, setLoading] = useState(true); // Estado para controlar o carregador

  useEffect(() => {
    // Listener para detectar qualquer tecla
    const handleKeyPress = () => setLoading(false);
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (loading) return; // Aguarda até o carregador ser desativado

    const scene = new THREE.Scene();

    // Configurar câmera
    const camera = new THREE.PerspectiveCamera(
      75, // Campo de visão reduzido para criar zoom
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, -0.3); // Câmera extremamente próxima
    camera.lookAt(new THREE.Vector3(0, 1, 0)); // Foco inicial no avatar

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Configurar cena
    setupScene(scene);

    // Carregar avatar
    const { avatarGroup, mixer, switchAnimation, idleAction, walkAction } =
      loadAvatar(scene);

    // Configurar controles
    const keysPressed = {};
    setupControls(keysPressed);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      if (avatarGroup) {
        moveAvatar(
          avatarGroup,
          keysPressed,
          delta,
          switchAnimation,
          walkAction,
          idleAction
        );

        // Atualizar a câmera
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
  }, [loading]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        <div>
          <p>Bem-vindo ao Museu Virtual</p>
          <p>Pressione qualquer tecla para prosseguir</p>
        </div>
      </div>
    );
  }

  return null; // Não renderiza nada após o carregador ser desativado
};

export default App;
