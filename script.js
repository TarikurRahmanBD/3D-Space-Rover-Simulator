const canvas = document.getElementById('sceneCanvas');
const speedSlider = document.getElementById('speedSlider');
const roverXValue = document.getElementById('roverX');
const roverZValue = document.getElementById('roverZ');
const speedValue = document.getElementById('speedValue');
const nearestObstacleValue = document.getElementById('nearestObstacle');
const followCameraToggle = document.getElementById('followCameraToggle');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb, 1);
renderer.domElement.style.display = 'block';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';

const container = document.querySelector('.scene-shell') || document.body;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe2a76f);
scene.fog = new THREE.FogExp2(0xe2a76f, 0.015);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

let followCamera = true;
let controls = null;

try {
  if (window.THREE && window.THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.zoomSpeed = 1.2;
    controls.target.set(0, 0, 0);
    controls.enabled = true;
  }
} catch (error) {
  console.warn('OrbitControls failed to initialize:', error);
  controls = null;
}

const fallbackGeometry = new THREE.BoxGeometry(1, 1, 1);
const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const fallbackCube = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
scene.add(fallbackCube);

const clock = new THREE.Clock();
let currentSpeed = 0;

function updateFollowButton() {
  followCameraToggle.textContent = followCamera ? 'Camera Follow: On' : 'Camera Follow: Off';
}

followCameraToggle.addEventListener('click', () => {
  followCamera = !followCamera;
  updateFollowButton();

  if (controls) {
    controls.enabled = true;
    if (followCamera) {
      controls.target.copy(rover.position).add(new THREE.Vector3(0, 0.8, 0));
    } else {
      controls.target.set(0, 0, 0);
    }
    controls.update();
  }
});

updateFollowButton();

const ambientLight = new THREE.AmbientLight(0xfff1d0, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffd700, 1.1);
directionalLight.position.set(-8, 14, 10);
directionalLight.castShadow = true;
directionalLight.shadow.radius = 4;
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);

const grid = new THREE.GridHelper(40, 40, 0x8b4513, 0x5a3717);
grid.position.y = 0.001;
scene.add(grid);

const rover = new THREE.Group();
scene.add(rover);

const obstacles = [];

function randomSafePosition(minDistance = 5, spread = 26) {
  let x;
  let z;
  let attempts = 0;

  do {
    x = (Math.random() * 2 - 1) * spread;
    z = (Math.random() * 2 - 1) * spread;
    attempts += 1;
  } while (Math.hypot(x, z) < minDistance && attempts < 100);

  if (Math.hypot(x, z) < minDistance) {
    const angle = Math.random() * Math.PI * 2;
    x = Math.cos(angle) * minDistance;
    z = Math.sin(angle) * minDistance;
  }

  return { x, z };
}

function addObstacle(x, z, size, height, color) {
  const obstacleGroup = new THREE.Group();
  obstacleGroup.position.set(x, 0, z);

  const rockMaterials = [
    new THREE.MeshStandardMaterial({ color, roughness: 0.92, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.9), roughness: 0.92, flatShading: true }),
  ];

  const shapeCount = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < shapeCount; i += 1) {
    const radius = size * (0.45 + Math.random() * 0.35);
    const geometry = Math.random() > 0.5
      ? new THREE.DodecahedronGeometry(radius, 0)
      : new THREE.IcosahedronGeometry(radius, 0);

    const rock = new THREE.Mesh(geometry, rockMaterials[i % rockMaterials.length]);
    rock.position.set((Math.random() - 0.5) * size * 0.7, radius * 0.4, (Math.random() - 0.5) * size * 0.7);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rock.castShadow = true;
    rock.receiveShadow = true;
    obstacleGroup.add(rock);
  }

  obstacleGroup.scale.y = 0.9 + height * 0.1;
  scene.add(obstacleGroup);
  obstacles.push(obstacleGroup);
  return obstacleGroup;
}

const rockColors = [0x4a4136, 0x6e5a4f, 0x7a6a5d, 0x8b5e3c, 0x5b4c3b];
const rockCount = 36;
for (let i = 0; i < rockCount; i += 1) {
  const position = randomSafePosition(7, 26);
  const size = 0.8 + Math.random() * 1.8;
  const height = 0.9 + Math.random() * 2.2;
  const color = rockColors[Math.floor(Math.random() * rockColors.length)];
  addObstacle(position.x, position.z, size, height, color);
}

for (let j = 0; j < 6; j += 1) {
  const position = randomSafePosition(7, 28);
  const size = 2.5 + Math.random() * 1.4;
  const height = 2.2 + Math.random() * 1.4;
  const color = rockColors[Math.floor(Math.random() * rockColors.length)];
  addObstacle(position.x, position.z, size, height, color);
}

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0x2563eb,
  metalness: 0.3,
  roughness: 0.4,
});

const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.6), bodyMaterial);
body.position.y = 0.8;
rover.add(body);

const headlight = new THREE.SpotLight(0xfff2c2, 3.2, 18, Math.PI / 7, 0.35, 1.5);
headlight.position.set(0, 0.95, 1.1);
headlight.target.position.set(0, 0.3, 8);
rover.add(headlight);
rover.add(headlight.target);

const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 0.7, 1.0),
  new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 })
);
cabin.position.set(0, 1.25, 0);
rover.add(cabin);

const wheelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 20);
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });

const particleGroup = new THREE.Group();
scene.add(particleGroup);

const particleCount = 32;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities = new Float32Array(particleCount * 3);
const particleLifetimes = new Float32Array(particleCount);
const particleMaxLifetimes = new Float32Array(particleCount);
const particleSizes = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i += 1) {
  particlePositions[i * 3 + 0] = 0;
  particlePositions[i * 3 + 1] = 0;
  particlePositions[i * 3 + 2] = 0;
  particleVelocities[i * 3 + 0] = (Math.random() - 0.5) * 0.02;
  particleVelocities[i * 3 + 1] = Math.random() * 0.025 + 0.015;
  particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  particleLifetimes[i] = 0;
  particleMaxLifetimes[i] = 0.45 + Math.random() * 0.25;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
  color: 0xe2e8f0,
  size: 0.12,
  transparent: true,
  opacity: 0.7,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
particleGroup.add(particles);

const wheels = [];

function addWheel(x, z) {
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, 0.35, z);
  rover.add(wheel);
  wheels.push(wheel);
  return wheel;
}

addWheel(-1.05, 0.95);
addWheel(1.05, 0.95);
addWheel(-1.05, -0.95);
addWheel(1.05, -0.95);

rover.position.set(0, 0.15, 0);

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

let speed = Number(speedSlider.value);
const acceleration = 12.0;
const friction = 10.0;
const turnRate = 1.8;

function setKeyState(action, isActive) {
  if (action === 'stop') {
    Object.keys(keys).forEach((key) => {
      keys[key] = false;
    });
    currentSpeed = 0;
    return;
  }

  if (Object.prototype.hasOwnProperty.call(keys, action)) {
    keys[action] = isActive;
  }
}

function mapKeyToAction(key) {
  const normalized = key.toLowerCase();
  if (['arrowup', 'w', 'f'].includes(normalized)) return 'forward';
  if (['arrowdown', 's', 'b'].includes(normalized)) return 'backward';
  if (['arrowleft', 'a'].includes(normalized)) return 'left';
  if (['arrowright', 'd'].includes(normalized)) return 'right';
  return null;
}

document.querySelectorAll('button[data-action]').forEach((button) => {
  const action = button.dataset.action;
  const press = () => setKeyState(action, true);
  const release = () => setKeyState(action, false);

  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointerleave', release);
  button.addEventListener('pointerout', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('touchstart', press, { passive: true });
  button.addEventListener('touchend', release);
  button.addEventListener('touchcancel', release);

  button.addEventListener('click', () => {
    if (action === 'stop') {
      setKeyState('stop', true);
    }
  });
});

window.addEventListener('keydown', (event) => {
  const action = mapKeyToAction(event.key);
  if (action) {
    event.preventDefault();
    setKeyState(action, true);
  }
});

window.addEventListener('keyup', (event) => {
  const action = mapKeyToAction(event.key);
  if (action) {
    event.preventDefault();
    setKeyState(action, false);
  }
});

window.addEventListener('blur', () => {
  setKeyState('stop', true);
});

speedSlider.addEventListener('input', (event) => {
  speed = Number(event.target.value);
});

function updateDriveSpeed(deltaTime) {
  const max = speed;
  if (keys.forward && !keys.backward) {
    currentSpeed = Math.min(max, currentSpeed + acceleration * deltaTime);
  } else if (keys.backward && !keys.forward) {
    currentSpeed = Math.max(-max, currentSpeed - acceleration * deltaTime);
  } else {
    if (currentSpeed > 0) {
      currentSpeed = Math.max(0, currentSpeed - friction * deltaTime);
    } else {
      currentSpeed = Math.min(0, currentSpeed + friction * deltaTime);
    }
  }
}

function getRoverBoundsAt(nextPosition) {
  const previousPosition = rover.position.clone();
  rover.position.copy(nextPosition);
  rover.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(rover).expandByScalar(0.05);
  rover.position.copy(previousPosition);
  rover.updateMatrixWorld(true);
  return bounds;
}

function hasCollision(nextPosition) {
  const roverBounds = getRoverBoundsAt(nextPosition);
  return obstacles.some((obstacle) => {
    obstacle.updateMatrixWorld(true);
    const obstacleBounds = new THREE.Box3().setFromObject(obstacle).expandByScalar(0.05);
    return roverBounds.intersectsBox(obstacleBounds);
  });
}

function updateTelemetry() {
  roverXValue.textContent = rover.position.x.toFixed(2);
  roverZValue.textContent = rover.position.z.toFixed(2);
  speedValue.textContent = speed.toFixed(0);

  const nearestDistance = obstacles.reduce((closest, obstacle) => {
    const dx = rover.position.x - obstacle.position.x;
    const dz = rover.position.z - obstacle.position.z;
    const distance = Math.hypot(dx, dz);
    return distance < closest ? distance : closest;
  }, Infinity);

  nearestObstacleValue.textContent = Number.isFinite(nearestDistance) ? nearestDistance.toFixed(2) : '0.00';
}

function canMoveTo(nextPosition, moveVector) {
  const roverBounds = getRoverBoundsAt(nextPosition);
  return !obstacles.some((obstacle) => {
    obstacle.updateMatrixWorld(true);
    const obstacleBounds = new THREE.Box3().setFromObject(obstacle).expandByScalar(0.05);
    return roverBounds.intersectsBox(obstacleBounds);
  });
}

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();
  const turnStep = turnRate * deltaTime;

  updateDriveSpeed(deltaTime);

  const forwardDirection = new THREE.Vector3(
    Math.sin(rover.rotation.y),
    0,
    Math.cos(rover.rotation.y)
  );

  if (currentSpeed !== 0) {
    const moveDistance = currentSpeed * deltaTime;
    const moveVector = forwardDirection.clone().multiplyScalar(moveDistance);
    const nextPosition = rover.position.clone().add(moveVector);

    const movingForward = currentSpeed > 0;
    const movingBackward = currentSpeed < 0;
    const canMove = canMoveTo(nextPosition, moveVector);

    if (canMove || movingBackward) {
      rover.position.copy(nextPosition);
    } else if (movingForward) {
      currentSpeed = 0;
    }

    wheels.forEach((wheel) => {
      wheel.rotation.x += (Math.abs(currentSpeed) * 2.6) * deltaTime * (currentSpeed > 0 ? 1 : -1);
    });
  }

  if (keys.left) {
    rover.rotation.y += turnStep;
  }

  if (keys.right) {
    rover.rotation.y -= turnStep;
  }

  if (controls) {
    const followTarget = rover.position.clone().add(new THREE.Vector3(0, 0.8, 0));
    controls.target.lerp(followTarget, 0.08);

    if (followCamera && !controls.isDragging) {
      const forward = new THREE.Vector3(Math.sin(rover.rotation.y), 0, Math.cos(rover.rotation.y));
      const desiredOffset = rover.position.clone()
        .addScaledVector(forward, -4.5)
        .add(new THREE.Vector3(0, 2.2, 0));
      const cameraPosition = controls.object.position;
      cameraPosition.lerp(desiredOffset, 0.08);
    }

    controls.update();
  }

  const particlePositionsArray = particleGeometry.attributes.position.array;
  const emitPosition = rover.position.clone().add(new THREE.Vector3(-0.8 * Math.sin(rover.rotation.y), 0.25, -0.8 * Math.cos(rover.rotation.y)));
  const isMoving = keys.forward || keys.backward;

  for (let i = 0; i < particleCount; i += 1) {
    if (isMoving && particleLifetimes[i] <= 0) {
      const spawnOffset = (Math.random() - 0.5) * 0.12;
      particlePositionsArray[i * 3 + 0] = emitPosition.x + spawnOffset;
      particlePositionsArray[i * 3 + 1] = emitPosition.y + Math.random() * 0.08;
      particlePositionsArray[i * 3 + 2] = emitPosition.z + spawnOffset;
      particleVelocities[i * 3 + 0] = (Math.random() - 0.5) * 0.025;
      particleVelocities[i * 3 + 1] = Math.random() * 0.03 + 0.01;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.025;
      particleLifetimes[i] = particleMaxLifetimes[i];
      particleSizes[i] = 0.06 + Math.random() * 0.05;
    }

    if (particleLifetimes[i] > 0) {
      particlePositionsArray[i * 3 + 0] += particleVelocities[i * 3 + 0];
      particlePositionsArray[i * 3 + 1] += particleVelocities[i * 3 + 1];
      particlePositionsArray[i * 3 + 2] += particleVelocities[i * 3 + 2];
      particleVelocities[i * 3 + 1] -= 0.0015;
      particleLifetimes[i] -= 0.016;

      const lifeRatio = particleLifetimes[i] / particleMaxLifetimes[i];
      const opacity = Math.max(0, lifeRatio * 0.75);
      particleMaterial.opacity = 0.6;
      if (lifeRatio < 0.2) {
        particlePositionsArray[i * 3 + 1] -= 0.01;
      }
    }
  }

  particleGeometry.attributes.position.needsUpdate = true;
  particleGroup.position.copy(rover.position);
  particleGroup.rotation.y = rover.rotation.y;
  particleGroup.position.y = 0.15;
  updateTelemetry();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
