import * as THREE from 'three';

// ============================
// СЦЕНА
// ============================
const container = document.getElementById('three-container');
const scene = new THREE.Scene();

// ============================
// КАМЕРА
// ============================
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

// ============================
// РЕНДЕРЕР
// ============================
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// ============================
// СВЕТ
// ============================
const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.position.set(5, 8, 10);
scene.add(mainLight);

const backLight = new THREE.DirectionalLight(0x0075ff, 0.3);
backLight.position.set(-5, -3, -5);
scene.add(backLight);

// ============================
// ЗВЁЗДЫ (частицы)
// ============================
const starsCount = 2500;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starsCount * 3);
const starSizes = new Float32Array(starsCount);

for (let i = 0; i < starsCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 80;
    if (i % 3 === 2) starPositions[i] *= 0.6; // чуть сплюснуть по Z
}

for (let i = 0; i < starsCount; i++) {
    starSizes[i] = 0.05 + Math.random() * 0.12;
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.06,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ============================
// ПАРЯЩИЕ ГЕОМЕТРИЧЕСКИЕ ФИГУРЫ
// ============================
const shapes = [];

// 1. Большой тор (кольцо)
const torusGeometry = new THREE.TorusGeometry(2.2, 0.08, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0x0075ff,
    metalness: 0.7,
    roughness: 0.2,
    transparent: true,
    opacity: 0.25,
    emissive: 0x0075ff,
    emissiveIntensity: 0.1,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.x = -1.5;
torus.position.y = 0.5;
torus.rotation.x = 0.3;
torus.rotation.z = 0.5;
scene.add(torus);
shapes.push(torus);

// 2. Маленькое кольцо
const torus2Geo = new THREE.TorusGeometry(1.4, 0.05, 12, 80);
const torus2Mat = new THREE.MeshStandardMaterial({
    color: 0x00b24b,
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.2,
    emissive: 0x00b24b,
    emissiveIntensity: 0.05,
});
const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
torus2.position.x = 2.2;
torus2.position.y = -0.3;
torus2.rotation.x = 0.7;
torus2.rotation.y = 0.3;
scene.add(torus2);
shapes.push(torus2);

// 3. Икосаэдр
const icoGeo = new THREE.IcosahedronGeometry(0.6, 0);
const icoMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.15,
    transparent: true,
    opacity: 0.08,
    wireframe: true,
});
const ico = new THREE.Mesh(icoGeo, icoMat);
ico.position.x = 3.5;
ico.position.y = 1.8;
scene.add(ico);
shapes.push(ico);

// 4. Маленькие сферы (орбита)
const orbGroup = new THREE.Group();
const orbCount = 8;
for (let i = 0; i < orbCount; i++) {
    const sphereGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0075ff,
        emissive: 0x0075ff,
        emissiveIntensity: 0.5,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    const angle = (i / orbCount) * Math.PI * 2;
    sphere.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 0.8, Math.sin(angle) * 0.6);
    orbGroup.add(sphere);
}
orbGroup.position.x = -0.5;
orbGroup.position.y = 0.2;
scene.add(orbGroup);
shapes.push(orbGroup);

// ============================
// МЫШЬ (лёгкий параллакс)
// ============================
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ============================
// АНИМАЦИЯ
// ============================
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Плавное следование за мышью
    targetX += (mouseX * 0.3 - targetX) * 0.05;
    targetY += (mouseY * 0.3 - targetY) * 0.05;

    // Вращение всей сцены
    stars.rotation.y = time * 0.008;
    stars.rotation.x = Math.sin(time * 0.005) * 0.03;

    // Кольца вращаются
    torus.rotation.x += 0.003;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.002;

    torus2.rotation.x += 0.004;
    torus2.rotation.y -= 0.006;

    // Икосаэдр
    ico.rotation.x += 0.008;
    ico.rotation.y += 0.012;

    // Орбита
    orbGroup.rotation.y += 0.008;
    orbGroup.rotation.x = Math.sin(time * 0.003) * 0.1;

    // Лёгкий параллакс всей сцены
    scene.position.x += (targetX * 0.15 - scene.position.x) * 0.02;
    scene.position.y += (targetY * 0.10 - scene.position.y) * 0.02;

    renderer.render(scene, camera);
}

animate();

// ============================
// АДАПТАЦИЯ ПОД РАЗМЕР ЭКРАНА
// ============================
function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    // На мобильных устройствах приближаем камеру
    if (width < 768) {
        camera.position.z = 10;
    } else {
        camera.position.z = 8;
    }
}

window.addEventListener('resize', onResize);
onResize();

console.log('✨ 3D-сцена загружена');
