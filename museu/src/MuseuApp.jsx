import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import setupScene from "./components/SceneSetup";
import "./index.css";

const MuseuApp = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  useEffect(() => {
    if (!isStarted) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    setupScene(scene);

    const loader = new GLTFLoader();
    let avatarGroup = new THREE.Group();
    let mixer = null;
    let idleAction = null;
    let walkAction = null;
    let currentAction = null;

    loader.load(
      "/adam.glb",
      (gltf) => {
        const avatar = gltf.scene;
        avatar.scale.set(1, 1, 1);
        avatar.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
          }
        });
        avatarGroup.add(avatar);
        scene.add(avatarGroup);

        // Configure animations
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

        setIsAvatarLoaded(true); // Avatar loaded
      },
      undefined,
      (error) => {
        console.error("Error loading avatar:", error);
      }
    );

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
      const limit = 9;
      position.x = THREE.MathUtils.clamp(position.x, -limit, limit);
      position.z = THREE.MathUtils.clamp(position.z, -limit, limit);
    };

    const updateCamera = () => {
      if (avatarGroup) {
        const avatarPosition = avatarGroup.position;
        const cameraOffset = new THREE.Vector3(0, 2, -3);
        const rotatedOffset = cameraOffset
          .clone()
          .applyEuler(new THREE.Euler(0, avatarGroup.rotation.y, 0));
        const targetPosition = avatarPosition.clone().add(rotatedOffset);

        targetPosition.y = Math.max(avatarPosition.y + cameraOffset.y, 1);
        targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, -8.5, 8.5);
        targetPosition.z = THREE.MathUtils.clamp(targetPosition.z, -8.5, 8.5);

        camera.position.lerp(targetPosition, 0.2);
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

        if (keysPressed["w"]) direction.z = 0.2;
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

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, [isStarted]);

  return (
    <>
      {!isStarted && (
        <div className="welcome-screen">
          <h1>Bem-vindo ao Museu Virtual</h1>
          <p>Explore um mundo interativo e aprenda mais!</p>
          <button onClick={() => setIsStarted(true)}>Iniciar</button>
        </div>
      )}
      {isStarted && !isAvatarLoaded && (
        <div className="loading-screen">
          <p>Carregando avatar...</p>
        </div>
      )}
    </>
  );
};

export default MuseuApp;
