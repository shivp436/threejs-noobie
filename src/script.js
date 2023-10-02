import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// loader
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/normalmap.png');


// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereGeometry(0.5, 64, 64); // radius, widthSegments, heightSegments

// Materials
const material = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    color: 0x292929,
    normalMap: normalTexture
});

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Light 1
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// light 2
const pointLight2 = new THREE.PointLight(0xff0000, 10); // color, intensity
pointLight2.position.set(-2.29, 2.03, -1.8);
scene.add(pointLight2);

// add light2 gui controller
const light2 = gui.addFolder('Light 2')
light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01);
light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
light2.add(pointLight2, 'intensity').min(1).max(10).step(0.1)

// add pointlight2 helper
const pointlight2Helper = new THREE.PointLightHelper(pointLight2)
// scene.add(pointlight2Helper)

// light3
const pointLight3 = new THREE.PointLight(0x0000ff, 10);
pointLight3.position.set(2.07, -0.91, -0.91);
scene.add(pointLight3)

// add light3 gui controller
const light3 = gui.addFolder('Light 3')
light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01);
light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01);
light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01);
light3.add(pointLight3, 'intensity').min(1).max(10).step(0.1)
// add color to gui controller
const light3Color = {
    color: 0x0000ff
}
light3.addColor(light3Color, 'color')
    .onChange(() => {
        pointLight3.color.set(light3Color.color)
    })


// add pointlight3 helper
const pointlight3Helper = new THREE.PointLightHelper(pointLight3)
// scene.add(pointlight3Helper)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

// change rotation on mouse move
window.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}

function updateSphere(event) {
    sphere.position.y = window.scrollY * 0.001
}

// change size on scroll
window.addEventListener('scroll', updateSphere)

const clock = new THREE.Clock();

const tick = () => {
    targetX = mouseX * .001
    targetY = mouseY * .001

	const elapsedTime = clock.getElapsedTime();

	// Update objects
	sphere.rotation.y = 0.5 * elapsedTime;

    // update sphere rotation on mouse move
    sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x)
    sphere.position.z += -0.05 * (targetY - sphere.rotation.x) // changing z position -> zoom

	// Update Orbital Controls
	// controls.update()

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
