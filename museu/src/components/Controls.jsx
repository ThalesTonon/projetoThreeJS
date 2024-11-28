import * as THREE from "three";

export const setupControls = (keysPressed) => {
  window.addEventListener("keydown", (event) => {
    keysPressed[event.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", (event) => {
    keysPressed[event.key.toLowerCase()] = false;
  });
};

export const moveAvatar = (
  avatarGroup,
  keysPressed,
  delta,
  switchAnimation,
  walkAction,
  idleAction
) => {
  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();

  if (avatarGroup) {
    direction.set(0, 0, 0);

    if (keysPressed["w"]) direction.z = 0.2;
    if (keysPressed["s"]) direction.z = -0.2;
    if (keysPressed["a"]) avatarGroup.rotation.y += delta * 2;
    if (keysPressed["d"]) avatarGroup.rotation.y -= delta * 2;

    direction.applyEuler(avatarGroup.rotation);
    velocity.add(direction.multiplyScalar(delta * 2));
    avatarGroup.position.add(velocity);

    // Mudar animação
    if (walkAction && (keysPressed["w"] || keysPressed["s"])) {
      switchAnimation(walkAction);
    } else if (idleAction && !keysPressed["w"] && !keysPressed["s"]) {
      switchAnimation(idleAction);
    }

    velocity.multiplyScalar(0.9); // Desacelerar
  }
};
