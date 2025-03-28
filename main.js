

import * as THREE from 'three';
import { scene, camera, renderer } from './threeSetup.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

//Variables 
const lightPosition = { x: 0, y: 30, z: 20 };

//Create Shelves Geometry
const shelfWidth = 50;
const geometry = new RoundedBoxGeometry(shelfWidth, 2, 10, 10, 0.3); // (Width, Height, Depth, Segments, Radius)
const material = new THREE.MeshStandardMaterial({ color: 0xB0BAAD });
const cube = new THREE.Mesh(geometry, material);
const cube1 = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry, material);


//Shelf Geometry Settings
cube.position.set(0, 0, 0);
cube1.position.set(0, 15, 0);
cube2.position.set(0, -15, 0);

// Enable shadow casting
cube.castShadow = true;
cube1.castShadow = true;
cube2.castShadow = true;

//Initialize Cubes
scene.add(cube, cube1, cube2);

// Lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 0);
// ambientLight.position.set(0, 0, 10);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xF1E0C5, 1);

directionalLight.castShadow = true;
directionalLight.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
directionalLight.shadow.mapSize.width = 2048; // Default is 512
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.left = -30;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = -30;
directionalLight.shadow.camera.near = 11;
directionalLight.shadow.camera.far = 55;

scene.add(directionalLight);

//light helper

const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(lightHelper);

// Create Shader Material with Gradient
const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color1: { value: new THREE.Color(0xE5D0BF) }, // Beige
        color2: { value: new THREE.Color(0xffdfc5) }  // White
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
    `
});




// GLTF Loader
const loader = new GLTFLoader();

// Raycaster for Hover Detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let shibaModels = []; // Store all loaded models

function onPointerMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    console.log("Pointer Move", event, mouse.x, mouse.y);

}

//Orbit Controlls
const orbitControls = new OrbitControls(camera, renderer.domElement);

// Function to Load the Shiba Model
const shiba3D = (position) => {
    return new Promise((resolve, reject) => {
        loader.load('./assets/shiba/scene.gltf',
            function (gltf) {
                let shibaModel = gltf.scene;
                shibaModel.scale.set(3, 3, 3);
                shibaModel.position.set(position.x, position.y, position.z);
                shibaModel.castShadow = true;
                shibaModel.userData = {
                    baseY: position.y,
                    bounceStartTime: null
                };
                scene.add(shibaModel);
                resolve(shibaModel); // ✅ return the model when loaded
            },
            undefined,
            function (error) {
                console.error("Error loading model:", error);
                reject(error);
            }
        );
    });
};

//Dynamically make the shibas


const loadAllShibas = async () => {
    const shibaSpacing = 20;

    const positions = [
        // Middle Shelf
        { x: -shibaSpacing, y: 4, z: 3 },
        { x: 0, y: 4, z: 3 },
        { x: shibaSpacing, y: 4, z: 3 },

        // Top Shelf
        { x: -shibaSpacing, y: 19, z: 3 },
        { x: 0, y: 19, z: 3 },
        { x: shibaSpacing, y: 19, z: 3 },

        // Bottom Shelf
        { x: -shibaSpacing, y: -11, z: 3 },
        { x: 0, y: -11, z: 3 },
        { x: shibaSpacing, y: -11, z: 3 }
    ];

    const shibaPromises = positions.map(pos => shiba3D(pos));
    shibaModels = await Promise.all(shibaPromises); // ✅ Assign to global array
};

loadAllShibas();

function getRootObject(obj) {
    while (obj.parent && !shibaModels.includes(obj)) {
        obj = obj.parent;
    }
    return obj;
}

// Animation Loop for Hover Rotation
let hoveredShiba = null;

function animate(time) {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(shibaModels, true);

    const deltaTime = time * 0.001; // convert to seconds

    if (intersects.length > 0) {
        const intersectedRoot = getRootObject(intersects[0].object);

        if (hoveredShiba !== intersectedRoot) {
            // Reset previous
            if (hoveredShiba) {
                hoveredShiba.rotation.y = 0;
                hoveredShiba.position.y = hoveredShiba.userData.baseY;
                hoveredShiba.userData.bounceStartTime = null;
            }

            // Set new hovered
            hoveredShiba = intersectedRoot;
            hoveredShiba.userData.bounceStartTime = deltaTime;
        }

        // Animate hover
        if (hoveredShiba) {
            hoveredShiba.rotation.y += 0.01;

            // BOUNCE using sine wave
            const elapsed = deltaTime - hoveredShiba.userData.bounceStartTime;
            const bounceHeight = .5; // amplitude
            const bounceSpeed = 3; // frequency
            hoveredShiba.position.y = hoveredShiba.userData.baseY + 1 + Math.sin(elapsed * bounceSpeed) * bounceHeight;
        }

    } else {
        // No hover
        if (hoveredShiba) {
            hoveredShiba.rotation.y = 0;
            hoveredShiba.position.y = hoveredShiba.userData.baseY;
            hoveredShiba.userData.bounceStartTime = null;
            hoveredShiba = null;
        }
    }

    orbitControls.update();
    renderer.render(scene, camera);
}




window.addEventListener('mousemove', onPointerMove);

window.requestAnimationFrame(animate);
animate();




// Create Ground to Receive Shadows
const groundGeometry = new THREE.PlaneGeometry(50, 1000);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5, color: 0xB0BAAD, side: THREE.DoubleSide }); // Transparent shadow effect
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / -2; // Make it horizontal
ground.position.y = -20;
//ground.position.set(0, 0, 0);
//ground.receiveShadow = true;
scene.add(ground);


