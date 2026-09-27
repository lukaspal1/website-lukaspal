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
    {
        img: 'images/bridalveil.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/col.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/pantheon.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/cupsaucer.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/stnicholas.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/vaticangallery.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/vatican.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/hlubolka2.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/marinerschurch.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/ocean.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/snezka.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/dresdenpark.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/forum.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/sunset.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/nightpraguecastle.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: 'landscape'
    },
    {
        img: 'images/fountainrome.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/goldenrider.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/mcdonaldsrome.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/outsidecol.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    },
    {
        img: 'images/romebuilding.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: ''
    }
];
const gymRoomPictures = [
    {
        img: 'images/385bench.jpg',
        title: '285lbs Bench',
        date: '',
        desc: '',
    },
    {
        img: 'images/325squat.jpg',
        title: '325 Squat for 2',
        date: '',
        desc: '',
    },
    {
        img: 'images/janflex.jpg',
        title: '',
        date: '',
        desc: '',
        orientation: 'landscape'
    }
];

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
// The hallway now extends toward -Z (see below), which is the camera's
// natural default facing direction in three.js — so we spawn on the +Z
// side, near the back wall, exactly mirroring the old setup.
camera.position.set(0, 2, 10); // eye height

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.prepend(renderer.domElement);

// ----- LIGHTING -----
const ambient = new THREE.AmbientLight(0x404060, 1);
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
    ctx.fillStyle = '#000000';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;

    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText(title, canvas.width / 2, 65);

    ctx.font = '24px Georgia, serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(date, canvas.width / 2, 120);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#000000';

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
// ----- CENTRAL FOUNTAIN / STATUE -----
const fountainGroup = new THREE.Group();

// Fountain basin (circular base)
const basinGeom = new THREE.CylinderGeometry(2.5, 2.8, 1.2, 16);
const basinMat = new THREE.MeshStandardMaterial({ color: 0xDCD2C4, roughness: 0.6 });
const basin = new THREE.Mesh(basinGeom, basinMat);
basin.position.y = 0.6; // sits on floor
basin.castShadow = true;
basin.receiveShadow = true;
fountainGroup.add(basin);

// Water surface (dark blue)
const waterMat = new THREE.MeshStandardMaterial({ 
    color: 0x3A6B8A, 
    roughness: 0.2, 
    metalness: 0.3, 
    transparent: true, 
    opacity: 0.8 
});
const waterGeom = new THREE.CylinderGeometry(2.2, 2.2, 0.1, 16);
const water = new THREE.Mesh(waterGeom, waterMat);
water.position.y = 1.2; // just above basin rim
fountainGroup.add(water);

// Central pedestal
const pedestalGeom = new THREE.CylinderGeometry(0.8, 1.0, 1.5, 8);
const pedestalMat = marbleMat; // reuse marble
const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
pedestal.position.y = 1.95;
fountainGroup.add(pedestal);

// Simple statue (cylinder + sphere head)
const statueMat = new THREE.MeshStandardMaterial({ color: 0xEDE6DC, roughness: 0.5 });
const statueBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.6, 1.8, 8),
    statueMat
);
statueBody.position.y = 3.6;
fountainGroup.add(statueBody);

const statueHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 8, 8),
    statueMat
);
statueHead.position.y = 4.7;
fountainGroup.add(statueHead);

// Add fountain to scene (sits at the origin — unaffected by which way the hallway faces)
scene.add(fountainGroup);

// Collision box for the fountain (square approximation)
const fountainCollision = new THREE.Box3(
    new THREE.Vector3(-2.8, 0, -2.8),
    new THREE.Vector3(2.8, 4.8, 2.8)
);
obstacles.push(fountainCollision);

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


const foyerWidth = 24;
const foyerDepth = 25;
const hallwayWidth = 8;
const hallwayLength = 24;
const wallHeight = 5.5;
const wallThickness = 0.25;

const roomWidth = 30;   // X extent — the distance you actually WALK into a room (the room's long axis)
const roomDepth = 8;    // Z extent — the room's left-right width as you stand inside it (the room's short axis)
const doorWidth = 3;

// Foyer occupies roughly Z = -12.5 to +12.5.
// The hallway now extends from the foyer toward NEGATIVE Z — this is the
// key flip: three.js cameras face -Z by default, so with the hallway built
// this way, yaw = 0 (no rotation at all) already looks straight down it.
const foyerCenterZ = 0;
const hallwayStartZ = -foyerDepth / 2;
const hallwayCenterZ = hallwayStartZ - hallwayLength / 2;

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
    floorMat,
    false
);

addBox(
    hallwayWidth,
    0.2,
    hallwayLength,
    0,
    wallHeight,
    hallwayCenterZ,
    floorMat,
    false
);

// ----- MAIN FOYER -----
// Back wall — the dead-end of the building, opposite the hallway.
// Since the hallway now runs toward -Z, this solid wall sits at +Z.
addBox(
    foyerWidth,
    wallHeight,
    wallThickness,
    0,
    wallHeight / 2,
    foyerDepth / 2,
    wallMat
);

// Foyer side walls (centered on Z=0, so mirroring doesn't move them).
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

// Four corner pillars — this layout is symmetric about Z=0, so it's
// identical either way the hallway faces; nothing to flip here.
addPillar(-6.5, -5.5);
addPillar(6.5, -5.5);
addPillar(-6.5, 5.5);
addPillar(6.5, 5.5);

// ----- HALLWAY SIDE WALLS -----
// Each side is split into sections so the side-room doors have real openings.
//
// Left/right room doors occur around these Z positions. Since the hallway
// now runs toward -Z, each offset below is subtracted instead of added —
// everything else about how these are used is unchanged.
const room1Z = hallwayStartZ - 4;
const room2Z = hallwayStartZ - 12;
const room3Z = room1Z;
const room4Z = room2Z;

// Hallway X boundaries.
const hallwayLeftX = -hallwayWidth / 2;
const hallwayRightX = hallwayWidth / 2;

// Helper: create a wall segment along Z.
// Made order-independent (sorts its own inputs) so it doesn't matter
// whether "deeper into the hallway" means increasing or decreasing Z —
// this is what makes the whole level safe to mirror.
function addWallSegment(x, zA, zB) {
    const zStart = Math.min(zA, zB);
    const zEnd = Math.max(zA, zB);
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
const z1 = room1Z + doorWidth / 2;
const z2 = room1Z - doorWidth / 2;
const z3 = room2Z + doorWidth / 2;
const z4 = room2Z - doorWidth / 2;
const z5 = hallwayStartZ - hallwayLength;

addWallSegment(hallwayLeftX, z0, z1);
addWallSegment(hallwayLeftX, z2, z3);
addWallSegment(hallwayLeftX, z4, z5);

addWallSegment(hallwayRightX, z0, z1);
addWallSegment(hallwayRightX, z2, z3);
addWallSegment(hallwayRightX, z4, z5);

// ----- FOUR SIDE ROOMS -----
// Rooms are placed outside the hallway.
// Their inner walls also have door openings aligned with the hallway.
function addRoomSign(text, x, z, side) {

    // Sign board
    const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.8, 0.12),
        brassMat
    );

    signBoard.position.set(x, 4, z);

    // Create text canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;

    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#8A6B3D';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#C4A86A';
    ctx.lineWidth = 12;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    // Text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 90px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Texture
    const signTexture = new THREE.CanvasTexture(canvas);
    signTexture.needsUpdate = true;

    const signMaterial = new THREE.MeshBasicMaterial({
        map: signTexture,
        side: THREE.DoubleSide
    });

    const signText = new THREE.Mesh(
        new THREE.PlaneGeometry(2.6, 0.65),
        signMaterial
    );

    signText.position.set(x, 4, z);

    // Face the hallway — this rotates around the room's X-facing wall,
    // which the Z-flip never touches, so this logic is unchanged.
    if (side === "left") {
        signBoard.rotation.y = Math.PI / 2;
        signText.rotation.y = Math.PI / 2;
        // Move text slightly towards the hallway (+X direction)
        signText.position.x += 0.08;
    } else {
        signBoard.rotation.y = -Math.PI / 2;
        signText.rotation.y = -Math.PI / 2;
        // Move text slightly towards the hallway (-X direction)
        signText.position.x -= 0.08;
    }

    scene.add(signBoard);
    scene.add(signText);
}

function addRoom({
    centerX,
    centerZ,
    doorZ,
    side,
    name,
    pictures = []   // <-- accepts an array of picture objects
}) {
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);  
    const isLeftRoom = side === "left";

    const outerX = centerX + (isLeftRoom ? -roomWidth / 2 : roomWidth / 2);
    const innerX = centerX + (isLeftRoom ? roomWidth / 2 : -roomWidth / 2);

    const roomMinZ = centerZ - roomDepth / 2;
    const roomMaxZ = centerZ + roomDepth / 2;

    // Room floor
    addBox(roomWidth, 0.2, roomDepth, centerX, -0.1, centerZ, floorMat, false);
    // Room ceiling
    addBox(roomWidth, 0.2, roomDepth, centerX, wallHeight, centerZ, floorMat, false);

    // Far wall — opposite the doorway, at the end of the room you walk toward.
    addBox(wallThickness, wallHeight, roomDepth, outerX, wallHeight / 2, centerZ, wallMat, true);

    // The room's two long side walls (spanning its full walking-in length).
    // These are just physical panels here — which one ends up on the
    // player's actual left vs right is worked out below, in the picture
    // gallery section, since that's the only place it actually matters.
    addBox(roomWidth, wallHeight, wallThickness, centerX, wallHeight / 2, roomMaxZ, wallMat, true);
    addBox(roomWidth, wallHeight, wallThickness, centerX, wallHeight / 2, roomMinZ, wallMat, true);

    // Inner wall split around the doorway (this is the true "front"/door wall)
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

    // ----- ROOM NAME SIGN -----
    addRoomSign(
        name,
        innerX + (isLeftRoom ? +0.18 : -0.18),
        doorZ,
        side
    );

    // ----- PICTURE GALLERY -----
    if (pictures.length > 0) {

        const frameW = 1.8;
        const frameH = 2.4;

        const imageW = 1.6;
        const imageH = 2.2;

        const plaqueW = 1.6;
        const plaqueH = 0.7;

        const spacing = 3;
        const wallOffset = 0.15;

        // Wall capacities. The far wall is narrow (roomDepth = 8), so it
        // only fits a couple of pictures. The two long side walls
        // (roomWidth = 30) each fit up to 10.
        const farWallMax = 2;
        const leftWallMax = 10;
        const rightWallMax = 10;

        // ---------------------------------------------------------------
        // WHICH ABSOLUTE WALL IS THE PLAYER'S LEFT VS RIGHT?
        //
        // Walking into a left-side room means facing -X; walking into a
        // right-side room means facing +X — those are opposite directions,
        // so "right hand" points at opposite absolute Z walls depending on
        // which side of the hallway the room is on. Working it out once,
        // explicitly, here — instead of scattered per-side ternaries — is
        // what prevents this from silently breaking again later.
        //
        // Facing (facingX, 0, 0) with up = +Y, the right-hand direction is
        // (0, 0, facingX). So: facing -X (left room) -> right = -Z -> roomMinZ.
        // Facing +X (right room) -> right = +Z -> roomMaxZ.
        // ---------------------------------------------------------------
        const facingX = isLeftRoom ? -1 : 1;
        const rightWallZ = facingX > 0 ? roomMaxZ : roomMinZ;
        const leftWallZ = facingX > 0 ? roomMinZ : roomMaxZ;

        // A picture's rotation only depends on which side of the room's
        // own center its wall sits on — that's a purely local relationship
        // and never needs to change no matter how the outer level is built.
        const rotationForWall = (wallZ) => (wallZ > centerZ ? Math.PI : 0);
        const inwardOffset = (wallZ) => (wallZ > centerZ ? -wallOffset : wallOffset);

        const createGalleryPicture = (imgData, position, rotationY) => {

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
        // FAR WALL — opposite the doorway (outerX). Narrow wall, few pictures.
        // =========================================================
        const farPictures = pictures.slice(0, farWallMax);
        const farStartZ = centerZ - (farPictures.length - 1) * spacing / 2;
        // The far wall's normal always points back toward the doorway (-X
        // for right rooms, since outerX is the +X extreme; +X for left rooms).
        const farRotationY = isLeftRoom ? Math.PI / 2 : -Math.PI / 2;
        const farOffset = isLeftRoom ? wallOffset : -wallOffset;

        for (let i = 0; i < farPictures.length; i++) {
            const position = new THREE.Vector3(
                outerX + farOffset,
                wallHeight / 2 - 0.1,
                farStartZ + i * spacing
            );
            createGalleryPicture(farPictures[i], position, farRotationY);
        }

        // =========================================================
        // LEFT WALL — the player's actual left as they walk in.
        // =========================================================
        const leftPictures = pictures.slice(farWallMax, farWallMax + leftWallMax);
        const leftStartX = centerX - (leftPictures.length - 1) * spacing / 2;
        const leftRotationY = rotationForWall(leftWallZ);
        const leftOffset = inwardOffset(leftWallZ);

        for (let i = 0; i < leftPictures.length; i++) {
            const position = new THREE.Vector3(
                leftStartX + i * spacing,
                wallHeight / 2 - 0.1,
                leftWallZ + leftOffset
            );
            createGalleryPicture(leftPictures[i], position, leftRotationY);
        }

        // =========================================================
        // RIGHT WALL — the player's actual right as they walk in.
        // =========================================================
        const rightPictures = pictures.slice(
            farWallMax + leftWallMax,
            farWallMax + leftWallMax + rightWallMax
        );
        const rightStartX = centerX - (rightPictures.length - 1) * spacing / 2;
        const rightRotationY = rotationForWall(rightWallZ);
        const rightOffset = inwardOffset(rightWallZ);

        for (let i = 0; i < rightPictures.length; i++) {
            const position = new THREE.Vector3(
                rightStartX + i * spacing,
                wallHeight / 2 - 0.1,
                rightWallZ + rightOffset
            );
            createGalleryPicture(rightPictures[i], position, rightRotationY);
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
    name: "Visions of Gaming",
    pictures: gamingRoomPictures 

});

addRoom({
    centerX: -(hallwayWidth / 2 + roomWidth / 2),
    centerZ: room2Z,
    doorZ: room2Z,
    side: "left",
    name: "Travels",
    pictures: travelRoomPictures
});

addRoom({
    centerX: hallwayWidth / 2 + roomWidth / 2,
    centerZ: room3Z,
    doorZ: room3Z,
    side: "right",
    name: "Betterment",
    pictures: gymRoomPictures
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
let yaw = 0;   // three.js's default facing (-Z) already looks straight down the hallway
let pitch = 0;
let moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false;
const speed = 7.0;
// Jump physics
let verticalVelocity = 0;
let onGround = true;
const gravity = -20;       // How fast you fall
const jumpStrength = 8;    // How high you jump
const eyeHeight = 2.0;     // Your camera eye height

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
        case 'Space': 
            e.preventDefault(); 
            if (onGround) { 
                verticalVelocity = jumpStrength; 
                onGround = false; 
            } 
            break;
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
    camera.position.set(0, eyeHeight, 10); // near the back wall, facing the hallway
    yaw = 0;
    pitch = 0;
    verticalVelocity = 0; // Reset jump velocity
    onGround = true;      // Reset jump state
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

// Sign board — placed ahead of the spawn point, along the way into the hallway (-Z).
const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1.4, 0.15),
    new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.5,
        metalness: 0.2
    })
);

signBoard.position.set(0, 1.6, -8);
signGroup.add(signBoard);

// Sign text
const signTexture = createPlaqueTexture(
    "Under Construction",
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

signText.position.set(0, 1.6, -7.9);
// Plane's default normal (+Z) already faces back toward the spawn point
// (which is now on the +Z side), so no extra rotation is needed here.
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

    post.position.set(x, 1.0, -8);
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
        // ----- JUMP PHYSICS -----
    verticalVelocity += gravity * delta;                // Apply gravity
    camera.position.y += verticalVelocity * delta;      // Move up/down

    // Check if we hit the ground
    if (camera.position.y < eyeHeight) {
        camera.position.y = eyeHeight;                  // Snap back to ground
        verticalVelocity = 0;                           // Stop falling
        onGround = true;                                // Allow jump again
    }
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