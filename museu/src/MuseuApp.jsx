import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import setupScene from "./components/SceneSetup";
import "./index.css";

const MuseuApp = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  const [nearbyArtwork, setNearbyArtwork] = useState(null);

  useEffect(() => {
    if (!isStarted) return;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.shadowMap.enabled = false;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const container = document.querySelector(".three-container");
    container.appendChild(renderer.domElement);

    setupScene(scene);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let avatarGroup = new THREE.Group();
    let mixer = null;
    let idleAction = null;
    let walkAction = null;
    let currentAction = null;

    const loader = new GLTFLoader();
    loader.load(
      "/adam.glb",
      (gltf) => {
        const avatar = gltf.scene;
        avatar.scale.set(1, 1, 1);
        avatarGroup.add(avatar);
        scene.add(avatarGroup);

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

        setIsAvatarLoaded(true);
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

    const keyDownHandler = (event) => {
      keysPressed[event.key.toLowerCase()] = true;
      if (walkAction && (keysPressed["w"] || keysPressed["s"])) {
        switchAnimation(walkAction);
      }
    };

    const keyUpHandler = (event) => {
      keysPressed[event.key.toLowerCase()] = false;
      if (idleAction && !keysPressed["w"] && !keysPressed["s"]) {
        switchAnimation(idleAction);
      }
    };

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

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

    const artworksData = [
      {
        name: "Buddha near Peshawar, Pakistan",
        description:
          "Esta é uma representação de Buda de 2.000 anos, encontrada próxima a Peshawar, no Paquistão. Este artefato da era Gandara é conhecido por sua fusão única de influências greco-romanas e indianas. Representa a serenidade do Buda e simboliza a disseminação do Budismo ao longo da Rota da Seda.",
        link: "https://en.wikipedia.org/wiki/Buddhism_in_Pakistan",
        urlObj: "/buddha.glb",
        scale: { x: 2, y: 2, z: 2 },
        positionOffset: { x: 0, y: 1, z: 0 },
        rotationOffset: { x: 0, y: -28, z: 0 },
      },
      {
        name: "Effigy of a Knight, Victoria and Albert",
        description:
          "Uma efígie de um cavaleiro em armadura completa, datada de 1340-1350, encontrada no Reino Unido. Representa um cavaleiro em oração, com as pernas cruzadas, simbolizando sua devoção e possivelmente uma cruzada. Esta peça é um exemplo impressionante da arte funerária medieval.",
        link: "https://collections.vam.ac.uk/item/O14763/recumbent-effigy-of-a-knight-effigy-unknown/",
        urlObj: "/effigy.glb",
        scale: { x: 0.8, y: 0.8, z: 0.8 },
        positionOffset: { x: 0, y: 1.0, z: 0 },
        rotationOffset: { x: 0, y: -14, z: 0 },
      },
      {
        name: "Mourning Female Servant, Altes Museum",
        description:
          "Uma escultura de mármore do século IV a.C., representando uma serva em posição de luto. Originária da Grécia antiga, esta peça fazia parte de um monumento funerário e simboliza o respeito e a reverência aos falecidos, refletindo as tradições funerárias gregas.",
        link: "https://artsandculture.google.com/asset/servant-girls-mourning-at-a-grave-unknown/2AHWogySHNOL6A?hl=en",
        urlObj: "/mourning.glb",
        scale: { x: 2, y: 2, z: 2 },
        positionOffset: { x: 0, y: 0, z: 0 },
        rotationOffset: { x: 0, y: 6.28, z: 0 },
      },
      {
        name: "Angel Sculpture by Matteo Civitali",
        description:
          "Escultura renascentista criada por Matteo Civitali, representando um anjo em postura graciosa e em oração. Esta peça foi projetada para adornar um tabernáculo sagrado, destacando o senso de espiritualidade e a atenção aos detalhes típicos do Renascimento italiano.",
        link: "https://collections.vam.ac.uk/item/O12534/angel-statue-civitali-matteo/",
        urlObj: "/angel_sculpture_by_matteo_civitali.glb",
        scale: { x: 2, y: 2, z: 2 },
        positionOffset: { x: 0, y: 1, z: 0 },
        rotationOffset: { x: 0, y: 2, z: 0 },
      },
      {
        name: "Muttergottes (Virgin Mary), Liebighaus Frankfurt",
        description:
          "Uma impressionante escultura gótica da Virgem Maria, datada de cerca de 1470 e originária de Estrasburgo. Representa Maria entronizada com o Menino Jesus, simbolizando sua maternidade divina e sua relevância no cristianismo medieval. Sua policromia original e os detalhes refinados destacam a maestria do estilo gótico.",
        link: "https://www.liebieghaus.de/en/mittelalter/virgin-mary-annunciation-group",
        urlObj: "/muttergottes.glb",
        scale: { x: 4, y: 4, z: 4 },
        positionOffset: { x: 0, y: 1, z: 0 },
        rotationOffset: { x: 0, y: 0, z: 0 },
      },
      {
        name: "Pillar-shaped Cippus, Altes Museum, Berlin",
        description:
          "Um cipo em forma de pilar, datado do período romano, encontrado na região do Mediterrâneo. Este tipo de monumento era frequentemente usado como marcador funerário ou como inscrição comemorativa. Decorado com relevos intrincados, ele reflete a estética e as práticas culturais da época.",
        link: "https://www.flickr.com/photos/carolemage/5343973958",
        urlObj: "/pillar_cippus.glb",
        scale: { x: 1.5, y: 3, z: 1.5 },
        positionOffset: { x: 0, y: 0, z: 0 },
        rotationOffset: { x: 0, y: 0, z: 0 },
      },
    ];

    const radius = 6;
    const artworks = artworksData.map((art, i) => {
      const angle = ((2 * Math.PI) / artworksData.length) * i;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      return {
        ...art,
        position: new THREE.Vector3(x, 0, z),
        radius: 1,
      };
    });

    const artLoader = new GLTFLoader();

    const loadPromises = artworks.map(
      (art) =>
        new Promise((resolve, reject) => {
          artLoader.load(
            art.urlObj,
            (gltf) => resolve({ art, gltf }),
            undefined,
            (err) => {
              console.error(`Erro ao carregar ${art.name}`, err);
              reject(err);
            }
          );
        })
    );

    Promise.all(loadPromises).then((results) => {
      results.forEach(({ art, gltf }) => {
        const circleGeometry = new THREE.CircleGeometry(art.radius, 16);
        const circleMaterial = new THREE.MeshBasicMaterial({
          color: 0x118dd8,
          opacity: 0.3,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.rotation.x = -Math.PI / 2;
        circle.position.copy(art.position);
        circle.position.y = 0.0001;
        scene.add(circle);

        const artworkObj = gltf.scene;
        artworkObj.scale.set(art.scale.x, art.scale.y, art.scale.z);
        artworkObj.position.copy(art.position);
        artworkObj.position.x += art.positionOffset.x;
        artworkObj.position.y += art.positionOffset.y;
        artworkObj.position.z += art.positionOffset.z;

        artworkObj.rotation.x += art.rotationOffset.x;
        artworkObj.rotation.y += art.rotationOffset.y;
        artworkObj.rotation.z += art.rotationOffset.z;

        scene.add(artworkObj);
      });
    });

    let prevArtwork = null;
    let frameCount = 0;
    let lastTime = performance.now();
    const desiredFPS = 30;
    const msPerFrame = 1000 / desiredFPS;
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = now - lastTime;
      if (elapsed < msPerFrame) {
        return;
      }
      lastTime = now - (elapsed % msPerFrame);

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

        if (frameCount % 5 === 0 && artworks.length > 0) {
          let inRangeArtwork = null;
          for (const art of artworks) {
            const dist = avatarGroup.position.distanceTo(art.position);
            if (dist <= art.radius) {
              inRangeArtwork = art;
              break;
            }
          }

          if (inRangeArtwork !== prevArtwork) {
            prevArtwork = inRangeArtwork;
            setNearbyArtwork(inRangeArtwork);
          }
        }
        frameCount++;
      }

      updateCamera();
      renderer.render(scene, camera);
    };

    animate();

    const resizeHandler = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resizeHandler);

    // Limpeza na desmontagem ou quando isStarted mudar
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("resize", resizeHandler);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      // Cancelar a animação para não continuar rodando após desmontagem
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Limpar a cena asas
      scene.remove(avatarGroup);
      scene.remove(
        ...scene.children.filter(
          (child) => child.type === "Mesh" || child.type === "Group"
        )
      );
    };
  }, [isStarted]);

  return (
    <>
      {!isStarted && (
        <div className="welcome-screen">
          <h1>Bem-vindo ao Museu Virtual</h1>
          <p>Explore um mundo interativo e aprenda mais!</p>
          <button onClick={() => setIsStarted(true)}>Iniciar</button>

          <p> Por Matheus Viana, Thales e Webert </p>
        </div>
      )}
      {isStarted && (
        <div className="three-container" style={{ position: "relative" }}>
          {!isAvatarLoaded && (
            <div className="loading-screen">
              <p>Carregando avatar...</p>
            </div>
          )}
          {isAvatarLoaded && !nearbyArtwork && (
            <div
              className="camera-info"
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                background: "rgba(0,0,0,0.5)",
                padding: "5px",
                color: "#fff",
              }}
            >
              <p>
                Fique dentro do círculo azul para ver informações sobre a obra.
              </p>
            </div>
          )}
          {isAvatarLoaded && nearbyArtwork && (
            <div className="artwork-info">
              <button
                className="close-btn"
                onClick={() => setNearbyArtwork(null)}
              >
                ×
              </button>
              <h2>{nearbyArtwork.name}</h2>
              <p>{nearbyArtwork.description}</p>
              <a href={nearbyArtwork.link} target="_blank" rel="noreferrer">
                Saiba mais
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MuseuApp;
