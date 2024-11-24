import init, { ParticleSystem } from './three-lib/pkg/three_lib.js';
import * as THREE from 'three';

async function run() {
  const wasm = await init();

  const particleCount = 1000;
  const deltaTime = 0.016;

  // WebAssembly에서 파티클 시스템 생성
  const particleSystem = new ParticleSystem(particleCount);

  // 포인터로 WebAssembly 메모리 접근
  const positionsPtr = particleSystem.get_positions_ptr();
  const memory = new Float32Array(
    wasm.memory.buffer,
    positionsPtr,
    particleCount * 3
  );

  // Three.js 설정
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(memory, 3));

  const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  camera.position.z = 20;

  // 애니메이션 루프
  function animate() {
    requestAnimationFrame(animate);

    // WebAssembly로 파티클 업데이트
    particleSystem.update_positions(deltaTime);

    // Three.js 렌더링
    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();
}

run();
