import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import setupScene from "./components/SceneSetup";
import "./index.css";

const App = () => {
  const [isStarted, setIsStarted] = useState(false); // Controle do início da experiência
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false); // Controle de carregamento do avatar
  const [nearbyArtwork, setNearbyArtwork] = useState(null); // Obra de arte mais próxima do avatar

  useEffect(() => {
    if (!isStarted) return; // Não inicializa a cena até o botão de iniciar ser clicado

    // Configuração inicial
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // Controle de qualidade
    renderer.shadowMap.enabled = false;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Adiciona o renderizador ao container HTML
    const container = document.querySelector(".three-container");
    container.appendChild(renderer.domElement);

    // Configuração da cena e luz
    setupScene(scene);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Configuração do avatar e animações
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

        // Configura as animações do avatar
        mixer = new THREE.AnimationMixer(avatar);
        idleAction = mixer.clipAction(
          gltf.animations.find((clip) => clip.name === "idle")
        );
        walkAction = mixer.clipAction(
          gltf.animations.find((clip) => clip.name === "walk")
        );

        if (idleAction) {
          currentAction = idleAction;
          idleAction.play(); // Começa com a animação ociosa
        }

        setIsAvatarLoaded(true);
      },
      undefined,
      (error) => {
        console.error("Erro ao carregar avatar:", error);
      }
    );

    // Movimentação e controles
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
        switchAnimation(walkAction); // Ativa animação de caminhar
      }
    };

    const keyUpHandler = (event) => {
      keysPressed[event.key.toLowerCase()] = false;
      if (idleAction && !keysPressed["w"] && !keysPressed["s"]) {
        switchAnimation(idleAction); // Retorna para animação de ociosidade
      }
    };

    // Constrange a posição do avatar para não sair do limite
    const constrainPosition = (position) => {
      const limit = 9;
      position.x = THREE.MathUtils.clamp(position.x, -limit, limit);
      position.z = THREE.MathUtils.clamp(position.z, -limit, limit);
    };

    // Atualiza a posição da câmera em relação ao avatar
    const updateCamera = () => {
      if (avatarGroup) {
        const avatarPosition = avatarGroup.position;
        const cameraOffset = new THREE.Vector3(0, 2, -3);
        const rotatedOffset = cameraOffset
          .clone()
          .applyEuler(new THREE.Euler(0, avatarGroup.rotation.y, 0));
        const targetPosition = avatarPosition.clone().add(rotatedOffset);

        // Limita a posição da câmera para não ultrapassar os limites do cenário
        targetPosition.y = Math.max(avatarPosition.y + cameraOffset.y, 1);
        targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, -8.5, 8.5);
        targetPosition.z = THREE.MathUtils.clamp(targetPosition.z, -8.5, 8.5);

        camera.position.lerp(targetPosition, 0.2); // Suaviza o movimento da câmera
        camera.lookAt(avatarPosition.clone().add(new THREE.Vector3(0, 1.5, 0)));
      }
    };

    // Configuração das obras de arte
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

    // Posiciona as obras em um círculo
    const radius = 6;
    const artworks = artworksData.map((art, i) => {
      const angle = ((2 * Math.PI) / artworksData.length) * i;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      return {
        ...art,
        position: new THREE.Vector3(x, 0, z),
        radius: 1, // Define o raio de interação do avatar com a obra
      };
    });

    // Carregamento das obras no cenário
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
        artworkObj.position.copy(art.position).add(art.positionOffset);
        artworkObj.rotation.y += art.rotationOffset.y;
        scene.add(artworkObj);
      });
    });

    // Loop de animação
    const clock = new THREE.Clock();
    let frameCount = 0;
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

        if (frameCount % 5 === 0) {
          let inRangeArtwork = null;
          for (const art of artworks) {
            if (avatarGroup.position.distanceTo(art.position) <= art.radius) {
              inRangeArtwork = art;
              break;
            }
          }
          setNearbyArtwork(inRangeArtwork);
        }
        frameCount++;
      }

      updateCamera();
      renderer.render(scene, camera);
    };

    animate();

    // Resizing da janela
    const resizeHandler = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    // Limpeza na desmontagem
    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isStarted]);

  return (
    <>
      {!isStarted && (
        <div className="welcome-screen">
          <h1>Bem-vindo ao Museu Virtual</h1>
          <p>Explore um mundo interativo e aprenda mais!</p>
          <button onClick={() => setIsStarted(true)}>Iniciar</button>
          <p>Por Matheus Viana, Thales e Webert</p>
        </div>
      )}
      {isStarted && (
        <div className="three-container" style={{ position: "relative" }}>
          {!isAvatarLoaded && <div>Carregando avatar...</div>}
          {nearbyArtwork && (
            <div className="artwork-info">
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

export default App;
