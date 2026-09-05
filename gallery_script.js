import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// ----- CONFIGURATION -----
const COLORS = {
    // Pantheon palette
    void: 0x1A1714,          // warm deep shadow (not pure black)
    marbleLight: 0xEDE6DC,   // warm cream
    marbleDark: 0xC8BBA8,    // warm beige
    brass: 0x9A7B4C,         // aged bronze
    accent: 0x9A6B4A,        // warm terracotta / Roman brick
    floorDark: 0xB8A894,     // warm stone
    floorLight: 0xDCD2C4,    // pale travertine
};

// ----- DATA: ADD YOUR PICTURES HERE! -----
const gamingRoomPictures = [
    {
        img: 'images/ds3_2.jpg',
        title: 'Dark Souls III',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/eldenring2.jpg',
        title: 'Shadow of the Erdtree',
        date: 'Elden Rings',
        desc: 'Beating the DLC.',
        orientation: 'landscape'

    },
    {
        img: 'images/Eldenring1.jpg',
        title: 'Elden Ring',
        date: '',
        desc: 'Beat the game for the first time'
    },
    {
        img: 'images/firstberserker.jpg',
        title: 'First Berserker',
        date: '',
        desc: '',
        orientation: 'landscape'

    },
    {
        img: 'images/kingdomsofamalur.jpg',
        title: 'Kingdoms of Amalur',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/Monsterhunter.jpg',
        title: 'Monster Hunter',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/MHW_behemothkill.jpg',
        title: 'Monster Hunter World',
        date: '',
        desc: 'First Behemoth kill with the gentlemen',
        orientation: 'landscape'
    },
    {
        img: 'images/Mordhau.jpg',
        title: 'Mordhau',
        date: '',
        desc: ''

    },
    {
        img: 'images/necesse.jpg',
        title: 'Necesse',
        date: '',
        desc: '',
        orientation: 'landscape'

    },
    {
        img: 'images/newworld.jpg',
        title: 'New World',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/pogostuck.jpg ',
        title: 'Pogostuck',
        date: '',
        desc: '',
        orientation: 'landscape'

    },
    {
        img: 'images/DANGMAN.png',
        title: 'Guild Wars 2',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/105600_18.jpg',
        title: 'Vanilla Terraria',
        date: '',
        desc: ''
    },
    {
        img: 'images/tmod.jpg',
        title: 'TMod Playthrough 1',
        date: '',
        desc: ''
    },
    {
        img: 'images/tmod2.jpg',
        title: 'TMod Playthrough 2',
        date: '',
        desc: ''
    },
    {
        img: 'images/drip or drown.png',
        title: 'Sea of Thieves',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/outwards.jpg',
        title: 'Outward',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/payday2.jpg',
        title: 'Payday 2',
        date: '',
        desc: 'Getting the secret achievement with the gentlemen',
        orientation: 'landscape'
    },
    {
        img: 'images/sekiro.jpg',
        title: 'Sekiro',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/valheim.jpg',
        title: 'Valheim',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/scourge.png',
        title: 'Guild Wars 2',
        date: '',
        desc: 'Scourge'
    },
    {
        img: 'images/jump king.jpg',
        title: 'King of Jumping',
        date: 'August 10/2020',
        desc: 'Beat Jump King for the first time',
        orientation: 'landscape'
    },

    // Add more objects here. Use img: "" for an empty placeholder.
];
const travelRoomPictures = [
    {
        img: 'images/stocks.jpg',
        title: 'Me in Stocks',
        date: 'May 2024',
        desc: '',
    },
    {
        img: 'images/crawfish.jpg',
        title: 'Little Friend',
        date: 'July 2026',
        desc: '',
    },
]

// ----- SCENE SETUP -----
const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.void);
// ---- FULL BRIGHT OVERRIDE ----
// 1. Remove fog
scene.fog = null;

// 2. Boost ambient light
scene.children.forEach(child => {
    if (child.isAmbientLight) child.intensity = 2.0;
});

// 3. Add an extra bright hemisphere light
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(hemi);

// 4. Make all existing lights brighter
scene.children.forEach(child => {
    if (child.isDirectionalLight) child.intensity = 3.0;
    if (child.isSpotLight) child.intensity = 3.0;
});

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 0); // eye height


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.prepend(renderer.domElement);

// ----- LIGHTING -----
const ambient = new THREE.AmbientLight(0x404060, 0.4);
scene.add(ambient);

const mainLight = new THREE.DirectionalLight(0xffeedd, 1.8);
mainLight.position.set(5, 12, 8);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 30;
mainLight.shadow.camera.left = -15;
mainLight.shadow.camera.right = 15;
mainLight.shadow.camera.top = 15;
mainLight.shadow.camera.bottom = -15;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.5);
fillLight.position.set(-4, 3, -2);
scene.add(fillLight);

// ----- HELPER: CANVAS TEXTURES -----
function createMarbleTexture(width = 512, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Pantheon warm marble
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#EDE6DC');
    grad.addColorStop(0.5, '#DDD3C6');
    grad.addColorStop(1, '#C8BBA8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Warm brown veins (instead of cool grey)
    ctx.strokeStyle = 'rgba(180, 160, 140, 0.25)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        let x = Math.random() * width;
        let y = Math.random() * height;
        ctx.moveTo(x, y);
        for (let j = 0; j < 5; j++) {
            x += (Math.random() - 0.5) * 120;
            y += (Math.random() - 0.5) * 120;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    // Fine warm veins
    ctx.strokeStyle = 'rgba(200, 180, 160, 0.15)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        let x = Math.random() * width;
        let y = Math.random() * height;
        ctx.moveTo(x, y);
        for (let j = 0; j < 8; j++) {
            x += (Math.random() - 0.5) * 80;
            y += (Math.random() - 0.5) * 80;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    return texture;
}

function createFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const size = 64;
    // Warm Pantheon checkerboard
    const colors = ['#DCD2C4', '#B8A894'];
    for (let i = 0; i < canvas.width / size; i++) {
        for (let j = 0; j < canvas.height / size; j++) {
            ctx.fillStyle = colors[(i + j) % 2];
            ctx.fillRect(i * size, j * size, size, size);
        }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 6);
    texture.anisotropy = 4;
    return texture;
}
function createPlaqueTexture(title, date, desc, flip = false, fontSize = 28) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // If flip is true, mirror horizontally
    if (flip) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    }

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#8A6B3D');
    grad.addColorStop(0.5, '#A5834A');
    grad.addColorStop(1, '#7A5D34');
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#C4A86A';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#F5EFE6';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;

    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText(title, canvas.width / 2, 65);

    ctx.font = '24px Georgia, serif';
    ctx.fillStyle = '#D4C8B8';
    ctx.fillText(date, canvas.width / 2, 120);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#E8E0D6';

    const maxWidth = canvas.width - 60;
    const words = desc.split(' ');
    const lines = [];
    let line = '';

    for (const word of words) {
        const testLine = line ? line + ' ' + word : word;
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = testLine;
        }
    }

    if (line) {
        lines.push(line);
    }

    // Draw each line
    const lineHeight = 26;
    const startY = 170 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((text, i) => {
        ctx.fillText(
            text,
            canvas.width / 2,
            startY + i * lineHeight
        );
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}


// ----- BUILD THE PALACE: FOYER + MAIN HALLWAY + SIDE ROOMS -----

const marbleTex = createMarbleTexture();
const floorTex = createFloorTexture();

const marbleMat = new THREE.MeshStandardMaterial({
    map: marbleTex,
    roughness: 0.55,
    metalness: 0.05,
    color: 0xF5EFE6,    // warm white tint
});

const wallMat = new THREE.MeshStandardMaterial({
    color: 0xEDE6DC,    // warm cream
    roughness: 0.7,
    metalness: 0.05,
});

const brassMat = new THREE.MeshStandardMaterial({
    color: COLORS.brass,
    roughness: 0.45,
    metalness: 0.6,
});

const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.8,
    metalness: 0.0,
});


const darkMat = new THREE.MeshStandardMaterial({
    color: 0x2A2420,
    roughness: 0.9,
    metalness: 0.0,
});


const obstacles = [];

// Adds visual geometry and, optionally, a collision box.
function addBox(w, h, d, x, y, z, mat = marbleMat, collision = true) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    if (collision) {
        obstacles.push(
            new THREE.Box3(
                new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
                new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)
            )
        );
    }

    return mesh;
}


const foyerWidth = 12;
const foyerDepth = 10;
const hallwayWidth = 5;
const hallwayLength = 24;
const wallHeight = 4.5;
const wallThickness = 0.25;

const roomWidth = 30;
const roomDepth = 8;
const doorWidth = 2.4;

// Foyer occupies roughly Z = -5 to +5.
// Hallway starts at Z = +5 and continues toward +Z.
const foyerCenterZ = 0;
const hallwayStartZ = foyerDepth / 2;
const hallwayCenterZ = hallwayStartZ + hallwayLength / 2;

// ----- FLOORS -----
// Floors are visual only. They deliberately have NO collision.
addBox(foyerWidth, 0.2, foyerDepth, 0, -0.1, foyerCenterZ, floorMat, false);

addBox(
    hallwayWidth,
    0.2,
    hallwayLength,
    0,
    -0.1,
    hallwayCenterZ,
    floorMat,
    false
);

// ----- CEILINGS -----
// Visual only, no collision.
addBox(
    foyerWidth,
    0.2,
    foyerDepth,
    0,
    wallHeight,
    foyerCenterZ,
    wallMat,
    false
);

addBox(
    hallwayWidth,
    0.2,
    hallwayLength,
    0,
    wallHeight,
    hallwayCenterZ,
    wallMat,
    false
);

// ----- MAIN FOYER -----
// Back wall. The front remains open to the camera/player entry.
addBox(
    foyerWidth,
    wallHeight,
    wallThickness,
    0,
    wallHeight / 2,
    -foyerDepth / 2,
    wallMat
);

// Foyer side walls.
addBox(
    wallThickness,
    wallHeight,
    foyerDepth,
    -foyerWidth / 2,
    wallHeight / 2,
    foyerCenterZ,
    wallMat
);

addBox(
    wallThickness,
    wallHeight,
    foyerDepth,
    foyerWidth / 2,
    wallHeight / 2,
    foyerCenterZ,
    wallMat
);

// ----- FOYER DECORATIVE PILLARS -----
// These are deliberately placed away from the spawn point.
// Collision boxes are slightly smaller than the visual pillars.
function addPillar(x, z, radius = 0.35) {
    const height = wallHeight - 0.3;

    const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius * 1.2, height, 16),
        marbleMat
    );

    pillar.position.set(x, height / 2, z);
    scene.add(pillar);

    const collisionRadius = radius * 1.15;

    obstacles.push(
        new THREE.Box3(
            new THREE.Vector3(
                x - collisionRadius,
                0,
                z - collisionRadius
            ),
            new THREE.Vector3(
                x + collisionRadius,
                height,
                z + collisionRadius
            )
        )
    );
}

// Four corner pillars. None are near the center spawn.
addPillar(-4.6, -3.6);
addPillar(4.6, -3.6);
addPillar(-4.6, 3.6);
addPillar(4.6, 3.6);

// ----- HALLWAY SIDE WALLS -----
// Each side is split into sections so the side-room doors have real openings.
//
// Left/right room doors occur around these Z positions.
const room1Z = hallwayStartZ + 4;
const room2Z = hallwayStartZ + 12;
const room3Z = hallwayStartZ + 4;
const room4Z = hallwayStartZ + 12;

// Hallway X boundaries.
const hallwayLeftX = -hallwayWidth / 2;
const hallwayRightX = hallwayWidth / 2;

// Helper: create a wall segment along Z.
function addWallSegment(x, zStart, zEnd) {
    const length = zEnd - zStart;
    if (length <= 0) return;

    addBox(
        wallThickness,
        wallHeight,
        length,
        x,
        wallHeight / 2,
        (zStart + zEnd) / 2,
        wallMat,
        true
    );
}

// Leave a door-sized opening beside each room.
const z0 = hallwayStartZ;
const z1 = room1Z - doorWidth / 2;
const z2 = room1Z + doorWidth / 2;
const z3 = room2Z - doorWidth / 2;
const z4 = room2Z + doorWidth / 2;
const z5 = hallwayStartZ + hallwayLength;

addWallSegment(hallwayLeftX, z0, z1);
addWallSegment(hallwayLeftX, z2, z3);
addWallSegment(hallwayLeftX, z4, z5);

addWallSegment(hallwayRightX, z0, z1);
addWallSegment(hallwayRightX, z2, z3);
addWallSegment(hallwayRightX, z4, z5);

// ----- FOUR SIDE ROOMS -----
// Rooms are placed outside the hallway.
// Their inner walls also have door openings aligned with the hallway.

function addRoom({
    centerX,
    centerZ,
    doorZ,
    side,
    name,
    pictures = []   // <-- NEW: accepts an array of picture objects
}) {
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);  
    const outerX = centerX + (side === "left" ? -roomWidth / 2 : roomWidth / 2);
    const innerX = centerX + (side === "left" ? roomWidth / 2 : -roomWidth / 2);

    const roomMinZ = centerZ - roomDepth / 2;
    const roomMaxZ = centerZ + roomDepth / 2;

    // Room floor
    addBox(roomWidth, 0.2, roomDepth, centerX, -0.1, centerZ, floorMat, false);
    // Room ceiling (changed to wallMat for brightness)
    addBox(roomWidth, 0.2, roomDepth, centerX, wallHeight, centerZ, wallMat, false);

    // Outer wall (the wall facing the hallway)
    addBox(wallThickness, wallHeight, roomDepth, outerX, wallHeight / 2, centerZ, wallMat, true);

    // Back wall (far from hallway)
    addBox(roomWidth, wallHeight, wallThickness, centerX, wallHeight / 2, roomMaxZ, wallMat, true);

    // Front wall (near hallway)
    addBox(roomWidth, wallHeight, wallThickness, centerX, wallHeight / 2, roomMinZ, wallMat, true);

    // Inner wall split around the doorway
    const doorMinZ = doorZ - doorWidth / 2;
    const doorMaxZ = doorZ + doorWidth / 2;

    const segmentA = doorMinZ - roomMinZ;
    const segmentB = roomMaxZ - doorMaxZ;

    if (segmentA > 0) {
        addBox(wallThickness, wallHeight, segmentA, innerX, wallHeight / 2, (roomMinZ + doorMinZ) / 2, wallMat, true);
    }
    if (segmentB > 0) {
        addBox(wallThickness, wallHeight, segmentB, innerX, wallHeight / 2, (doorMaxZ + roomMaxZ) / 2, wallMat, true);
    }

    // Decorative doorway frame (brass)
    const frameDepth = 0.18;
    const frameHeight = wallHeight;
    const frameWidth = 0.16;

    addBox(frameWidth, frameHeight, frameDepth, innerX, frameHeight / 2, doorMinZ, brassMat, false);
    addBox(frameWidth, frameHeight, frameDepth, innerX, frameHeight / 2, doorMaxZ, brassMat, false);
    addBox(frameWidth, frameWidth, doorWidth + frameWidth * 2, innerX, wallHeight - frameWidth / 2, doorZ, brassMat, false);

    // ----- PICTURE GALLERY ON THE BACK WALL (Single Row) -----
    if (pictures.length > 0) {

        const backWallMax = 10
        const sideWallMax = 2
        const rightWallMax = 10
        

        const frameW = 1.8;
        const frameH = 2.4;

        const imageW = 1.6;
        const imageH = 2.2;

        const plaqueW = 1.6;
        const plaqueH = 0.7;

        const spacing = 3;
        const wallOffset = 0.15;


        // =========================================================
        // CREATE ONE PICTURE
        // =========================================================
        const createGalleryPicture = (imgData, position, rotationY) => {

            // ----- Orientation -----
            const isLandscape = imgData.orientation === "landscape";

            const currentFrameW = isLandscape ? frameH : frameW;
            const currentFrameH = isLandscape ? frameW : frameH;

            const currentImageW = isLandscape ? imageH : imageW;
            const currentImageH = isLandscape ? imageW : imageH;


            // ----- Frame -----
            const frame = new THREE.Mesh(
                new THREE.BoxGeometry(
                    currentFrameW,
                    currentFrameH,
                    0.08
                ),
                brassMat
            );

            frame.position.copy(position);
            frame.rotation.y = rotationY;
            roomGroup.add(frame);


            // ----- Image -----
            const texture = new THREE.TextureLoader().load(imgData.img);

            const imgMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.7,
                metalness: 0.1,
                side: THREE.DoubleSide
            });

            const imgPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(
                    currentImageW,
                    currentImageH
                ),
                imgMaterial
            );

            imgPlane.position.copy(position);
            imgPlane.rotation.y = rotationY;

            if (Math.abs(rotationY - Math.PI) < 0.01) {
                imgPlane.position.z -= 0.05;
            } else if (Math.abs(rotationY) < 0.01) {
                imgPlane.position.z += 0.05;
            } else if (rotationY < 0) {
                imgPlane.position.x -= 0.05;
            } else {
                imgPlane.position.x += 0.05;
            }

            roomGroup.add(imgPlane);


            // ----- Plaque -----
            const plaqueTexture = createPlaqueTexture(
                imgData.title,
                imgData.date,
                imgData.desc
            );

            const plaqueMaterial = new THREE.MeshStandardMaterial({
                map: plaqueTexture,
                side: THREE.DoubleSide
            });

            const plaque = new THREE.Mesh(
                new THREE.PlaneGeometry(plaqueW, plaqueH),
                plaqueMaterial
            );

            plaque.position.copy(position);

            // Use the actual frame height so the plaque stays
            // underneath both portrait and landscape pictures.
            plaque.position.y -=
                currentFrameH / 2 +
                plaqueH / 2 +
                0.15;

            plaque.rotation.y = rotationY;

            if (Math.abs(rotationY - Math.PI) < 0.01) {
                plaque.position.z -= 0.05;
            } else if (rotationY < 0) {
                plaque.position.x -= 0.05;
            } else {
                plaque.position.x += 0.05;
            }

            roomGroup.add(plaque);
        };


        // =========================================================
        // WALL 1 — BACK WALL
        // =========================================================

        const isLeftRoom = side === "left";

        const backWallZ = isLeftRoom
            ? roomMaxZ
            : roomMinZ;

        const backPictures = pictures.slice(0, backWallMax);

        const backStartX =
            centerX -
            (backPictures.length - 1) * spacing / 2;

        for (let i = 0; i < backPictures.length; i++) {

            const position = new THREE.Vector3(
                backStartX + i * spacing,
                wallHeight / 2 - 0.1,
                backWallZ + (isLeftRoom ? -wallOffset : wallOffset)
            );

            const rotationY = isLeftRoom
                ? Math.PI
                : 0;

            createGalleryPicture(
                backPictures[i],
                position,
                rotationY
            );
        }


        // =========================================================
        // WALL 2 — INNER / SIDE WALL
        // =========================================================

        const sidePictures = pictures.slice(
            backWallMax,
            backWallMax + sideWallMax
        );

        const sideStartZ =
            centerZ -
            (sidePictures.length - 1) * spacing / 2;

        const sideWallX = outerX;
        const sideRotationY = isLeftRoom ? Math.PI / 2 : -Math.PI / 2;

        for (let i = 0; i < sidePictures.length; i++) {

            const position = new THREE.Vector3(
                sideWallX + (isLeftRoom ? wallOffset : -wallOffset),
                wallHeight / 2 - 0.1,
                sideStartZ + i * spacing
            );

            createGalleryPicture(
                sidePictures[i],
                position,
                sideRotationY
            );
            
        }


        // =========================================================
        // WALL 3 — RIGHT WALL
        // =========================================================

        const rightPictures = pictures.slice(
            backWallMax + sideWallMax,
            backWallMax + sideWallMax + rightWallMax
        );

        const rightStartX =
            centerX - (rightPictures.length - 1) * spacing / 2;

        for (let i = 0; i < rightPictures.length; i++) {

            const position = new THREE.Vector3(
                rightStartX + i * spacing,
                wallHeight / 2 - 0.1,
                roomMinZ + wallOffset
            );

            // Rotate 90° relative to the left wall
            const rightRotationY = isLeftRoom
                ? 0
                : Math.PI;

            createGalleryPicture(
                rightPictures[i],
                position,
                rightRotationY
            );
        }
    }
}

// Left rooms extend to negative X.
// Right rooms extend to positive X.
addRoom({
    centerX: -(hallwayWidth / 2 + roomWidth / 2),
    centerZ: room1Z,
    doorZ: room1Z,
    side: "left",
    name: "Gallery I",
    pictures: gamingRoomPictures // <-- NEW: pass the pictures array here
});

addRoom({
    centerX: -(hallwayWidth / 2 + roomWidth / 2),
    centerZ: room2Z,
    doorZ: room2Z,
    side: "left",
    name: "Gallery II",
    pictures: travelRoomPictures // <-- NEW: pass the pictures array here
});

addRoom({
    centerX: hallwayWidth / 2 + roomWidth / 2,
    centerZ: room3Z,
    doorZ: room3Z,
    side: "right",
    name: "Gallery III"
});

addRoom({
    centerX: hallwayWidth / 2 + roomWidth / 2,
    centerZ: room4Z,
    doorZ: room4Z,
    side: "right",
    name: "Gallery IV"
});

// ----- END OF NEW PALACE LAYOUT -----

// ----- CONTROLS (Manual) -----
let isLocked = false;
let yaw = Math.PI;   // <-- YOUR DEFAULT: face down the hallway
let pitch = 0;
let moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false;
const speed = 7.0;

function updateCameraRotation() {
    const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(euler);
}

// Apply initial rotation (your default)
updateCameraRotation();

// ----- Pointer Lock (no Three.js controls) -----
renderer.domElement.addEventListener('click', () => {
    if (!isLocked) {
        document.body.requestPointerLock();
    }
});

document.addEventListener('pointerlockchange', () => {
    isLocked = document.pointerLockElement === document.body;
    const instr = document.getElementById('instruction');
    if (instr) instr.style.opacity = isLocked ? '0' : '1';
});

// ----- Mouse Look -----
document.addEventListener('mousemove', (event) => {
    if (!isLocked) return;

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    if (Math.abs(event.movementX) > 300 || Math.abs(event.movementY) > 300) {
        return;
    }
    yaw -= movementX * 0.002;
    pitch -= movementY * 0.002;

    pitch = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, pitch)
    );

    updateCameraRotation();
});

// ----- Keyboard -----
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
        case 'KeyR': resetPosition(); break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
    }
});



// ----- MOBILE JOYSTICK & TOUCH LOOK -----
let touchMove = { x: 0, y: 0 };
let isTouchingJoystick = false;
let isTouchingLook = false;
let lastTouchX = 0,
    lastTouchY = 0;

const joystickArea = document.getElementById('joystick-area');
const joystickKnob = document.getElementById('joystick-knob');

joystickArea.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isTouchingJoystick = true;
    joystickArea.classList.add('active');
    handleJoystick(e.touches[0]);
}, { passive: false });

joystickArea.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isTouchingJoystick) handleJoystick(e.touches[0]);
}, { passive: false });

joystickArea.addEventListener('touchend', (e) => {
    e.preventDefault();
    isTouchingJoystick = false;
    joystickArea.classList.remove('active');
    touchMove.x = 0;
    touchMove.y = 0;
    joystickKnob.style.transform = 'translate(-50%, -50%)';
}, { passive: false });

function handleJoystick(touch) {
    const rect = joystickArea.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = touch.clientX - cx;
    const dy = touch.clientY - cy;
    const maxDist = rect.width / 2 - 20;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    const normX = Math.cos(angle) * dist / maxDist;
    const normY = Math.sin(angle) * dist / maxDist;
    touchMove.x = normX;
    touchMove.y = -normY;
    const kx = normX * maxDist;
    const ky = -normY * maxDist;
    joystickKnob.style.transform = `translate(${-50 + (kx/maxDist)*50}%, ${-50 + (ky/maxDist)*50}%)`;
}

document.body.addEventListener('touchstart', (e) => {
    if (e.target.closest('#joystick-area')) return;
    isTouchingLook = true;
    const t = e.touches[0];
    lastTouchX = t.clientX;
    lastTouchY = t.clientY;
}, { passive: true });

document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('#joystick-area')) return;
    if (!isTouchingLook) return;
    const t = e.touches[0];
    const dx = t.clientX - lastTouchX;
    const dy = t.clientY - lastTouchY;
    yaw -= dx * 0.005;
    pitch -= dy * 0.005;
    pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
    updateCameraRotation();
    lastTouchX = t.clientX;
    lastTouchY = t.clientY;
}, { passive: true });

document.body.addEventListener('touchend', () => { isTouchingLook = false; }, { passive: true });

// ----- COLLISION & MOVEMENT -----
function checkCollision(newPos) {
    const testBox = new THREE.Box3(
        new THREE.Vector3(newPos.x - 0.3, newPos.y - 0.3, newPos.z - 0.3),
        new THREE.Vector3(newPos.x + 0.3, newPos.y + 1.0, newPos.z + 0.3)
    );
    for (let box of obstacles) {
        if (testBox.intersectsBox(box)) return true;
    }
    return false;
}

function resetPosition() {
    camera.position.set(0, 1.7, 0);
    yaw = Math.PI;
    pitch = 0;
    updateCameraRotation();
}

function addCofferedCeiling(w, d, x, y, z, mat = darkMat) {
    const rows = 4;
    const cols = 4;
    const cellW = w / cols;
    const cellD = d / rows;
    const depth = 0.15;
    const margin = 0.3;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cx = x - w/2 + cellW/2 + j * cellW;
            const cz = z - d/2 + cellD/2 + i * cellD;
            const cell = new THREE.Mesh(
                new THREE.BoxGeometry(cellW - margin, depth, cellD - margin),
                mat
            );
            cell.position.set(cx, y - depth/2, cz);
            cell.castShadow = false;
            cell.receiveShadow = false;
            scene.add(cell);
        }
    }
}
// ----- UNDER CONSTRUCTION SIGN -----

const signGroup = new THREE.Group();

// Sign board
const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1.4, 0.15),
    new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.2
    })
);

signBoard.position.set(0, 1.6, 3.2);
signGroup.add(signBoard);

// Sign text
const signTexture = createPlaqueTexture(
    "UNDER CONSTRUCTION",
    "",
    "",
    false,
    112
    
    
);

const signMaterial = new THREE.MeshStandardMaterial({
    map: signTexture,
    side: THREE.DoubleSide
    
});

const signText = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 1.1),
    signMaterial
    
);

signText.position.set(0, 1.6, 3.11);
signText.rotation.y = Math.PI; // Face the camera/player
signGroup.add(signText);

// Two support posts
const postMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.7,
    metalness: 0.4
});

for (const x of [-1.3, 1.3]) {
    const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 2.0, 0.12),
        postMaterial
    
    );

    post.position.set(x, 1.0, 3.2);
    signGroup.add(post);
}

scene.add(signGroup);
// ----- ANIMATION LOOP -----
const clock = new THREE.Clock();

function animate() {
    const delta = Math.min(clock.getDelta(), 0.05);

    const forwardVec = new THREE.Vector3();
    camera.getWorldDirection(forwardVec);
    forwardVec.y = 0;
    forwardVec.normalize();

    const rightVec = new THREE.Vector3();
    rightVec.crossVectors(forwardVec, new THREE.Vector3(0, 1, 0)).normalize();

    // ----- movement (unconditional: works with or without pointer lock) -----
let moveX = 0, moveZ = 0;

// Desktop keyboard (always active)
if (moveForward) { moveX += forwardVec.x; moveZ += forwardVec.z; }
if (moveBackward) { moveX -= forwardVec.x; moveZ -= forwardVec.z; }
if (moveLeft) { moveX -= rightVec.x; moveZ -= rightVec.z; }
if (moveRight) { moveX += rightVec.x; moveZ += rightVec.z; }

// Mobile joystick (adds to keyboard input, if any)
const jx = touchMove.x;
const jy = touchMove.y;
if (Math.abs(jx) > 0.1 || Math.abs(jy) > 0.1) {
    moveX += forwardVec.x * jy;
    moveZ += forwardVec.z * jy;
    moveX += rightVec.x * jx;
    moveZ += rightVec.z * jx;
}
    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (len > 0.01) {
        const normX = moveX / len;
        const normZ = moveZ / len;
        const step = speed * delta;
        const newPos = camera.position.clone();
        newPos.x += normX * step;
        newPos.z += normZ * step;
        if (!checkCollision(newPos)) {
            camera.position.copy(newPos);
        } else {
            const newPosX = camera.position.clone();
            newPosX.x += normX * step;
            if (!checkCollision(newPosX)) camera.position.x = newPosX.x;
            const newPosZ = camera.position.clone();
            newPosZ.z += normZ * step;
            if (!checkCollision(newPosZ)) camera.position.z = newPosZ.z;
        }
    }
//     console.log(
//     'yaw:', yaw,
//     'camera Y:', camera.rotation.y,
//     'pitch:', pitch,
//     'camera X:', camera.rotation.x
// );
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// ----- RESIZE & LOADING -----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
}, 1500);

window.resetPosition = resetPosition;

console.log('🏛️ Memory Palace loaded!');
console.log('Controls: WASD + mouse (click to lock) | Mobile: joystick + drag to look');
console.log('Press R to reset position.');
