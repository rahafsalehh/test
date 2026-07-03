import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 2, 6);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Lights (IMPORTANT for FBX models)
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Loader
const loader = new FBXLoader();

loader.load(
    'chair.fbx',
    (object) => {

        // Add to scene first
        scene.add(object);

        // Center model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        object.position.sub(center);

        // Auto scale to reasonable size
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxSize;
        object.scale.setScalar(scale);

        // Move camera to fit model
        camera.position.set(0, size.y * 0.5, size.z * 2.5);
        controls.target.set(0, 0, 0);
        controls.update();

        console.log("FBX loaded successfully");
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded');
    },
    (error) => {
        console.error("Error loading FBX:", error);
    }
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize fix
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});