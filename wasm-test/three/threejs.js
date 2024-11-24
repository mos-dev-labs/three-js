import * as THREE from 'three';

// Three.js Scene 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 파티클 초기화
const particleCount = 1000;
const positions = new Float32Array(particleCount * 3); // [x, y, z, x, y, z, ...]
const velocities = new Float32Array(particleCount * 3); // [vx, vy, vz, vx, vy, vz, ...]

for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10; // Random position
    velocities[i] = (Math.random() - 0.5) * 2; // Random velocity
}

// Three.js 파티클 시스템
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 20;

// 물리 계산 함수
function updatePositions(deltaTime) {
    for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;

        // 속도 기반 위치 업데이트
        positions[idx] += velocities[idx] * deltaTime;
        positions[idx + 1] += velocities[idx + 1] * deltaTime;
        positions[idx + 2] += velocities[idx + 2] * deltaTime;

        // 중력 효과 추가
        velocities[idx + 1] -= 9.81 * deltaTime;

        // 바운더리 체크 (경계 충돌)
        if (positions[idx + 1] < -5) {
            positions[idx + 1] = -5;
            velocities[idx + 1] *= -0.5; // 반사 속도 감소
        }
    }
}

// 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);

    // 물리 계산 업데이트
    updatePositions(0.016); // delta_time = 16ms

    // Three.js에 업데이트된 데이터 반영
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();
