import * as THREE from "three";

let isUserInteracting = false; // Rastreamento de interação manual

const updateCamera = (camera, avatarGroup, controls) => {
  // Detectar se o usuário está interagindo manualmente
  if (controls) {
    controls.addEventListener("start", () => (isUserInteracting = true));
    controls.addEventListener("end", () => (isUserInteracting = false));
  }

  // Atualização automática apenas quando o usuário não está interagindo
  if (!isUserInteracting && avatarGroup) {
    const avatarPosition = avatarGroup.position;

    // Configuração do offset para a câmera
    const cameraOffset = new THREE.Vector3(0, 1.5, -1.5); // Ajustar conforme necessário
    const rotatedOffset = cameraOffset
      .clone()
      .applyEuler(new THREE.Euler(0, avatarGroup.rotation.y, 0));
    const targetPosition = avatarPosition.clone().add(rotatedOffset);

    // Atualizar posição e foco da câmera
    camera.position.lerp(targetPosition, 0.2); // Suavidade na interpolação
    camera.lookAt(avatarPosition.clone().add(new THREE.Vector3(0, 1.5, 0))); // Ponto de foco
  }

  // Atualizar os controles de órbita
  if (controls) controls.update();
};

export default updateCamera;
