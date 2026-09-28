import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// ============================================================
// CONFIGURATION
// ============================================================
const COLORS = {
    void: 0x1A1714,
    brass: 0x9A7B4C,
};

// Set to 0 to keep the current look. Set to wallThickness / 2 (0.125) to push
// the wall panelling / dentils / egg-and-dart out to the wall SURFACE so it is
// actually visible (right now most of it sits buried inside the wall thickness).
// If you do that, also move the pictures out a bit (wallOffset in addRoom).
const TRIM_Z_OFFSET = 0;

// How close (world units) the player must be to a gallery before its
// pictures start loading.
const ROOM_LOAD_RADIUS = 30;

const NO_COLLISION = true;   // flip to false when you're done testing

// ============================================================
// DATA: ADD YOUR PICTURES HERE!
// ============================================================
const gamingRoomPictures = [
    { img: 'images/ds3_2.jpg', title: 'Dark Souls III', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/eldenring2.jpg', title: 'Shadow of the Erdtree', date: 'Elden Rings', desc: 'Beating the DLC.', orientation: 'landscape' },
    { img: 'images/Eldenring1.jpg', title: 'Elden Ring', date: '', desc: 'Beat the game for the first time' },
    { img: 'images/firstberserker.jpg', title: 'First Berserker', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/kingdomsofamalur.jpg', title: 'Kingdoms of Amalur', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/Monsterhunter.jpg', title: 'Monster Hunter', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/MHW_behemothkill.jpg', title: 'Monster Hunter World', date: '', desc: 'First Behemoth kill with the gentlemen', orientation: 'landscape' },
    { img: 'images/Mordhau.jpg', title: 'Mordhau', date: '', desc: '' },
    { img: 'images/necesse.jpg', title: 'Necesse', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/newworld.jpg', title: 'New World', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/pogostuck.jpg', title: 'Pogostuck', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/DANGMAN.png', title: 'Guild Wars 2', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/105600_18.jpg', title: 'Vanilla Terraria', date: '', desc: '' },
    { img: 'images/tmod.jpg', title: 'TMod Playthrough 1', date: '', desc: '' },
    { img: 'images/tmod2.jpg', title: 'TMod Playthrough 2', date: '', desc: '' },
    { img: 'images/drip or drown.png', title: 'Sea of Thieves', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/outwards.jpg', title: 'Outward', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/payday2.jpg', title: 'Payday 2', date: '', desc: 'Getting the secret achievement with the gentlemen', orientation: 'landscape' },
    { img: 'images/sekiro.jpg', title: 'Sekiro', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/valheim.jpg', title: 'Valheim', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/scourge.png', title: 'Guild Wars 2', date: '', desc: 'Scourge' },
    { img: 'images/jump king.jpg', title: 'King of Jumping', date: 'August 10/2020', desc: 'Beat Jump King for the first time', orientation: 'landscape' },
    // Add more objects here.
];

const travelRoomPictures = [
    { img: 'images/stocks.jpg', title: 'Me in Stocks', date: 'May 2024', desc: '' },
    { img: 'images/crawfish.jpg', title: 'Little Friend', date: 'July 2026', desc: '' },
    { img: 'images/bridalveil.jpg', title: '', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/col.jpg', title: '', date: '', desc: '' },
    { img: 'images/pantheon.jpg', title: '', date: '', desc: '' },
    { img: 'images/cupsaucer.jpg', title: '', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/stnicholas.jpg', title: '', date: '', desc: '' },
    { img: 'images/tuff.jpg', title: '', date: '', desc: '' },
    { img: 'images/vatican.jpg', title: '', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/hlubolka2.jpg', title: '', date: '', desc: '' },
    { img: 'images/marinerschurch.jpg', title: '', date: '', desc: '' },
    { img: 'images/ocean.jpg', title: '', date: '', desc: '' },
    { img: 'images/snezka.jpg', title: '', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/dresdenpark.jpg', title: '', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/forum.jpg', title: '', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/sunset.jpg', title: '', date: '', desc: '' },
    { img: 'images/nightpraguecastle.jpg', title: '', date: '', desc: '', orientation: 'landscape' },
    { img: 'images/fountainrome.jpg', title: '', date: '', desc: '' },
    { img: 'images/goldenrider.jpg', title: '', date: '', desc: '' },
    { img: 'images/mcdonaldsrome.jpg', title: '', date: '', desc: '' },
    { img: 'images/outsidecol.jpg', title: '', date: '', desc: '' },
    { img: 'images/romebuilding.jpg', title: '', date: '', desc: '' },
];

const gymRoomPictures = [
    { img: 'images/385bench.jpg', title: '285lbs Bench', date: '', desc: '' },
    { img: 'images/325squat.jpg', title: '325 Squat for 2', date: '', desc: '' },
    { img: 'images/janflex.jpg', title: '', date: '', desc: '', orientation: 'landscape' },
];

// ============================================================
// LAYOUT CONSTANTS (defined up front so every helper can use them)
// ============================================================
const foyerWidth = 24;
const foyerDepth = 25;
const hallwayWidth = 8;
const hallwayLength = 24;
const wallHeight = 7;
const wallThickness = 0.25;

const roomWidth = 30;   // walking-in length of a gallery
const roomDepth = 8;    // left-right width of a gallery
const doorWidth = 3;
const archTrimWidth = 0.22;   // marble frame around each doorway (see addGothicArchway)

const foyerCenterZ = 0;
const hallwayStartZ = -foyerDepth / 2;
const hallwayCenterZ = hallwayStartZ - hallwayLength / 2;

const room1Z = hallwayStartZ - 4;
const room2Z = hallwayStartZ - 12;
const room3Z = room1Z;
const room4Z = room2Z;

const hallwayLeftX = -hallwayWidth / 2;
const hallwayRightX = hallwayWidth / 2;

// ============================================================
// SCENE / RENDERER
// ============================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.void);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
// Capping at 1.5 saves a LOT of fill-rate on retina / phone screens.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.prepend(renderer.domElement);

// ----- LIGHTING -----
// (The old "FULL BRIGHT OVERRIDE" block ran before any lights existed, so it
// did nothing except add the hemisphere light. Same visible result, no dead code.)
scene.add(new THREE.AmbientLight(0x404060, 1));
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));

const mainLight = new THREE.DirectionalLight(0xffeedd, 1.8);
mainLight.position.set(5, 12, 8);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.5);
fillLight.position.set(-4, 3, -2);
scene.add(fillLight);

// ============================================================
// CANVAS TEXTURES
// ============================================================
function createMarbleTexture(width = 512, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#EDE6DC');
    grad.addColorStop(0.5, '#DDD3C6');
    grad.addColorStop(1, '#C8BBA8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const veins = (style, lw, count, steps, spread) => {
        ctx.strokeStyle = style;
        ctx.lineWidth = lw;
        for (let i = 0; i < count; i++) {
            ctx.beginPath();
            let x = Math.random() * width;
            let y = Math.random() * height;
            ctx.moveTo(x, y);
            for (let j = 0; j < steps; j++) {
                x += (Math.random() - 0.5) * spread;
                y += (Math.random() - 0.5) * spread;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    };
    veins('rgba(180, 160, 140, 0.25)', 4, 30, 5, 120);
    veins('rgba(200, 180, 160, 0.15)', 2, 50, 8, 80);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function createFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const size = 64;
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
    ctx.fillText(date, canvas.width / 2, 120);

    ctx.font = '20px sans-serif';

    const maxWidth = canvas.width - 60;
    const words = desc.split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
        const testLine = line ? line + ' ' + word : word;
        if (ctx.measureText(testLine).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = testLine;
        }
    }
    if (line) lines.push(line);

    const lineHeight = 26;
    const startY = 170 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((text, i) => ctx.fillText(text, canvas.width / 2, startY + i * lineHeight));

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// ============================================================
// SHARED MATERIALS
// ============================================================
const marbleMat = new THREE.MeshStandardMaterial({
    map: createMarbleTexture(),
    roughness: 0.55,
    metalness: 0.05,
    color: 0xF5EFE6,
});
const wallMat = new THREE.MeshStandardMaterial({ color: 0xEDE6DC, roughness: 0.7, metalness: 0.05 });
const brassMat = new THREE.MeshStandardMaterial({ color: COLORS.brass, roughness: 0.45, metalness: 0.6 });
const floorMat = new THREE.MeshStandardMaterial({ map: createFloorTexture(), roughness: 0.8, metalness: 0.0 });

const trimMatPanel  = new THREE.MeshStandardMaterial({ color: 0xC8BBA8, roughness: 0.65, metalness: 0.03 });
const trimMatAccent = new THREE.MeshStandardMaterial({ color: 0x9A6B4A, roughness: 0.80, metalness: 0.00 });
const trimMatCoffer = new THREE.MeshStandardMaterial({ color: 0x3A322C, roughness: 0.95, metalness: 0.00 });
const inlayMat      = new THREE.MeshStandardMaterial({ color: 0xE0D6C4, roughness: 0.50, metalness: 0.04 });

// Ceiling materials — ONE set shared by every ceiling (was re-created per call)
const ceilMat      = new THREE.MeshStandardMaterial({ color: 0xE8DFD0, roughness: 0.70 });
const cofferMat    = new THREE.MeshStandardMaterial({ color: 0x3A322C, roughness: 0.95 });
const ceilBrassMat = new THREE.MeshStandardMaterial({ color: 0x9A7B4C, roughness: 0.35, metalness: 0.75 });
const skyMat       = new THREE.MeshBasicMaterial({ color: 0xFFF6DC });

const obstacles = [];

// Visual box + optional collision box.
function addBox(w, h, d, x, y, z, mat = marbleMat, collision = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    if (collision) {
        obstacles.push(new THREE.Box3(
            new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2),
            new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2)
        ));
    }
    return mesh;
}

// ============================================================
// SHARED WALL TRIM
//
// The trim is split into two independent pieces:
//   trimLower()   baseboard + panel field + end pilasters
//   trimCornice() dentils / modillions / crown moulding
//
// Walls with doorways get the CORNICE across their full length (so it runs
// continuously over the top of every arch) but the LOWER trim only on the
// solid sections between doors — so nothing runs through a doorway opening.
//
// Everything is pooled by (chunk, material) and merged once at the end.
// Chunks (foyer / hall / each room) keep frustum culling useful — the old
// version merged the whole palace into a handful of giant meshes with
// frustumCulled = false, so the GPU drew all of it every frame.
// ============================================================
const trimBuckets = new Map();
let trimChunk = 'misc';

const TRIM_T = 0.08;
const FIELD_Y0 = 0.55;
const FIELD_Y1 = wallHeight - 0.78;
const WALL_FACE_Z = wallThickness / 2 + 0.002;   // local z of the wall surface

function makeTrimPlacer({ wallX, wallZ, wallRotY, offsetAlong = 0 }) {
    const rotM = new THREE.Matrix4().makeRotationY(wallRotY);
    const off = new THREE.Vector3(offsetAlong, 0, 0).applyMatrix4(rotM);
    const finalM = new THREE.Matrix4().makeRotationY(wallRotY);
    finalM.setPosition(wallX + off.x, 0, wallZ + off.z);

    return (geo, mat) => {
        if (TRIM_Z_OFFSET) geo.translate(0, 0, TRIM_Z_OFFSET);

        // Anything that sits completely inside the wall thickness can never
        // be seen — skip it instead of sending it to the GPU.
        geo.computeBoundingBox();
        if (geo.boundingBox.max.z <= WALL_FACE_Z) { geo.dispose(); return; }

        geo.applyMatrix4(finalM);
        const key = trimChunk + '|' + mat.uuid;
        let b = trimBuckets.get(key);
        if (!b) { b = { mat, geos: [] }; trimBuckets.set(key, b); }
        b.geos.push(geo);
    };
}

const BOX = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const CYLZ = (r, len, seg = 8) => {
    const g = new THREE.CylinderGeometry(r, r, len, seg);
    g.rotateZ(Math.PI / 2);
    return g;
};

function trimLower(opts) {
    const { wallLen, capMin = true, capMax = true } = opts;
    if (wallLen < 0.8) return;
    const lp = makeTrimPlacer(opts);
    const t = TRIM_T;
    const half = wallLen / 2;

    // ---------- BOTTOM TRIM ----------
    { const g = BOX(wallLen, 0.12, t * 2.0);  g.translate(0, 0.06,  t * 1.00); lp(g, trimMatPanel); }
    { const g = BOX(wallLen, 0.03, t * 1.7);  g.translate(0, 0.135, t * 0.85); lp(g, trimMatCoffer); }
    { const g = BOX(wallLen, 0.04, t * 1.85); g.translate(0, 0.17,  t * 0.925); lp(g, brassMat); }
    { const g = CYLZ(0.075, wallLen);         g.translate(0, 0.245, t * 0.90); lp(g, marbleMat); }
    { const g = CYLZ(0.050, wallLen);         g.translate(0, 0.320, t * 0.70); lp(g, trimMatAccent); }

    // Egg-and-dart band
    {
        const bandY = 0.400, spacing = 0.18;
        const count = Math.max(2, Math.floor(wallLen / spacing));
        const startX = -half + (wallLen - (count - 1) * spacing) / 2;
        for (let i = 0; i < count; i++) {
            const x = startX + i * spacing;
            if (i % 2 === 0) {
                const g = new THREE.SphereGeometry(0.045, 8, 6);
                g.scale(1, 1.2, 0.7);
                g.translate(x, bandY, t * 0.85);
                lp(g, marbleMat);
            } else {
                const g = BOX(0.02, 0.10, 0.04);
                g.translate(x, bandY, t * 0.85);
                lp(g, brassMat);
            }
        }
    }

    { const g = BOX(wallLen, 0.045, t * 1.4); g.translate(0, 0.475, t * 0.70); lp(g, brassMat); }
    { const g = CYLZ(0.025, wallLen, 6);      g.translate(0, 0.515, t * 0.65); lp(g, marbleMat); }

    // ---------- PANEL FIELD ----------
    { const g = BOX(wallLen, FIELD_Y1 - FIELD_Y0, 0.025);
      g.translate(0, (FIELD_Y0 + FIELD_Y1) / 2, 0.0125); lp(g, trimMatPanel); }

    const panelCount = Math.max(2, Math.floor(wallLen / 4.5));
    const gap = 0.3;
    const panelW = (wallLen - gap * (panelCount + 1)) / panelCount;
    const panelH = FIELD_Y1 - FIELD_Y0 - 0.55;
    const panelY = (FIELD_Y0 + FIELD_Y1) / 2;
    const frameW = 0.08, frameD = 0.05;

    if (panelW > 0.3) {
        for (let i = 0; i < panelCount; i++) {
            const px = -half + gap * (i + 1) + panelW * (i + 0.5);

            { const g = BOX(panelW, frameW, frameD); g.translate(px, panelY + panelH / 2 - frameW / 2, t * 0.25 + frameD / 2); lp(g, marbleMat); }
            { const g = BOX(panelW, frameW, frameD); g.translate(px, panelY - panelH / 2 + frameW / 2, t * 0.25 + frameD / 2); lp(g, marbleMat); }
            { const g = BOX(frameW, panelH - frameW * 2, frameD); g.translate(px - panelW / 2 + frameW / 2, panelY, t * 0.25 + frameD / 2); lp(g, marbleMat); }
            { const g = BOX(frameW, panelH - frameW * 2, frameD); g.translate(px + panelW / 2 - frameW / 2, panelY, t * 0.25 + frameD / 2); lp(g, marbleMat); }

            { const g = BOX(panelW - frameW * 2 - 0.02, panelH - frameW * 2 - 0.02, 0.02);
              g.translate(px, panelY, t * 0.25 + 0.01); lp(g, trimMatAccent); }
            { const g = BOX(0.20, 0.05, 0.04);
              g.translate(px, panelY + panelH / 2 - 0.18, t * 0.25 + frameD + 0.02); lp(g, brassMat); }
        }
    }

    // End pilasters (skipped on ends that butt up against a doorway)
    const pilW = 0.35, pilD = t * 1.3;
    for (const side of [-1, 1]) {
        if (side < 0 && !capMin) continue;
        if (side > 0 && !capMax) continue;
        const px = side * (wallLen / 2 - pilW / 2 - 0.05);
        { const g = BOX(pilW, FIELD_Y1 - FIELD_Y0, pilD); g.translate(px, (FIELD_Y0 + FIELD_Y1) / 2, pilD / 2); lp(g, marbleMat); }
        { const g = BOX(pilW + 0.15, 0.14, pilD + 0.10); g.translate(px, FIELD_Y1 - 0.07, (pilD + 0.10) / 2); lp(g, brassMat); }
        { const g = BOX(pilW + 0.12, 0.10, pilD + 0.08); g.translate(px, FIELD_Y0 + 0.05, (pilD + 0.08) / 2); lp(g, trimMatPanel); }
    }
}

function trimCornice(opts) {
    const { wallLen } = opts;
    if (wallLen < 0.5) return;
    const lp = makeTrimPlacer(opts);
    const t = TRIM_T;
    const half = wallLen / 2;

    { const g = CYLZ(0.025, wallLen, 6); g.translate(0, FIELD_Y1 + 0.05, t * 0.65); lp(g, marbleMat); }
    { const g = BOX(wallLen, 0.035, t * 1.2); g.translate(0, FIELD_Y1 + 0.10, t * 0.60); lp(g, brassMat); }

    // Dentil row
    {
        const dentilY = FIELD_Y1 + 0.20, spacing = 0.22;
        const count = Math.max(2, Math.floor(wallLen / spacing));
        const startX = -half + (wallLen - (count - 1) * spacing) / 2;
        for (let i = 0; i < count; i++) {
            const g = BOX(0.10, 0.14, t * 1.4);
            g.translate(startX + i * spacing, dentilY, t * 0.70);
            lp(g, marbleMat);
        }
    }

    // Modillion row
    {
        const modY = FIELD_Y1 + 0.36, spacing = 0.55;
        const count = Math.max(2, Math.floor(wallLen / spacing));
        const startX = -half + (wallLen - (count - 1) * spacing) / 2;
        for (let i = 0; i < count; i++) {
            const x = startX + i * spacing;
            { const g = BOX(0.22, 0.16, t * 1.8); g.translate(x, modY, t * 0.90); lp(g, marbleMat); }
            { const g = new THREE.SphereGeometry(0.06, 8, 6); g.translate(x, modY - 0.05, t * 0.50); lp(g, brassMat); }
            { const g = BOX(0.16, 0.03, t * 1.5); g.translate(x, modY - 0.10, t * 0.75); lp(g, trimMatAccent); }
        }
    }

    { const g = BOX(wallLen, 0.045, t * 2.2); g.translate(0, FIELD_Y1 + 0.485, t * 1.10); lp(g, brassMat); }
    { const g = BOX(wallLen, 0.10, t * 3.0);  g.translate(0, FIELD_Y1 + 0.56,  t * 1.50); lp(g, marbleMat); }
    { const g = CYLZ(0.045, wallLen); g.translate(0, FIELD_Y1 + 0.66, t * 2.40); lp(g, marbleMat); }
    { const g = CYLZ(0.030, wallLen); g.translate(0, FIELD_Y1 + 0.72, t * 2.00); lp(g, marbleMat); }
    { const g = BOX(wallLen, 0.03, t * 1.5); g.translate(0, FIELD_Y1 + 0.76, t * 0.75); lp(g, brassMat); }
}

// Solid wall with no doors: lower trim + cornice.
function buildTrimmedWall(opts) {
    trimLower(opts);
    trimCornice(opts);
}

// A wall running along Z (hallway sides, or a gallery's door wall) that may
// contain doorways.
//   x       world X of the wall
//   facing  +1 = trim faces +X, -1 = trim faces -X (i.e. toward the room it decorates)
//   doors   Z centres of the doorways
function trimZWall({ x, facing, zMin, zMax, doors = [] }) {
    const rotY = facing > 0 ? Math.PI / 2 : -Math.PI / 2;
    const gapHalf = doorWidth / 2 + archTrimWidth;   // stop at the outside edge of the marble arch frame

    // Cornice runs the full length, straight over the top of every doorway.
    trimCornice({ wallX: x, wallZ: (zMin + zMax) / 2, wallRotY: rotY, wallLen: zMax - zMin });

    // Lower trim only on the solid sections between doors.
    const cuts = doors.map(d => [d - gapHalf, d + gapHalf]).sort((a, b) => a[0] - b[0]);
    const segs = [];
    let cur = zMin;
    for (const [a, b] of cuts) {
        if (a > cur) segs.push([cur, a]);
        cur = Math.max(cur, b);
    }
    if (cur < zMax) segs.push([cur, zMax]);

    for (const [a, b] of segs) {
        const capZmin = a === zMin;
        const capZmax = b === zMax;
        // local +X points toward -Z when facing +1, toward +Z when facing -1
        trimLower({
            wallX: x, wallZ: (a + b) / 2, wallRotY: rotY, wallLen: b - a,
            capMin: facing > 0 ? capZmax : capZmin,
            capMax: facing > 0 ? capZmin : capZmax,
        });
    }
}

function finalizeTrim() {
    const group = new THREE.Group();
    group.name = 'PalaceWallTrim';
    for (const { mat, geos } of trimBuckets.values()) {
        if (!geos.length) continue;
        const merged = mergeGeometries(geos, false);
        if (merged) {
            const mesh = new THREE.Mesh(merged, mat);
            mesh.matrixAutoUpdate = false;
            group.add(mesh);           // frustum culling stays ON (per-chunk)
        }
        for (const g of geos) g.dispose();
    }
    scene.add(group);
    trimBuckets.clear();
}

// ============================================================
// COFFERED CEILINGS (all rooms pooled into 3 meshes total)
// ============================================================
const ceilingGeos = { ceil: [], coffer: [], brass: [] };

function addCofferedCeiling({ centerX, centerZ, width, depth, y = wallHeight - 0.12, cellSize = 4.0, oculusR = 0 }) {
    const hw = width / 2, hd = depth / 2;
    const cols = Math.max(1, Math.round(width / cellSize));
    const rows = Math.max(1, Math.round(depth / cellSize));
    const cellW = width / cols;
    const cellD = depth / rows;
    const margin = 0.22;

    if (oculusR > 0) {
        const shape = new THREE.Shape();
        shape.moveTo(-hw, -hd);
        shape.lineTo(hw, -hd);
        shape.lineTo(hw, hd);
        shape.lineTo(-hw, hd);
        shape.closePath();
        const hole = new THREE.Path();
        hole.absarc(0, 0, oculusR, 0, Math.PI * 2, true);
        shape.holes.push(hole);
        const g = new THREE.ShapeGeometry(shape, 48);
        g.rotateX(Math.PI / 2);
        g.translate(centerX, y, centerZ);
        ceilingGeos.ceil.push(g);
    } else {
        const g = new THREE.PlaneGeometry(width, depth);
        g.rotateX(Math.PI / 2);
        g.translate(centerX, y, centerZ);
        ceilingGeos.ceil.push(g);
    }

    const COFFER_Y = y - 0.012;
    const TRIM_Y = y - 0.020;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cx = centerX - hw + cellW / 2 + j * cellW;
            const cz = centerZ - hd + cellD / 2 + i * cellD;
            const cw = cellW - margin;
            const cd = cellD - margin;

            if (oculusR > 0) {
                const dx = Math.max(0, Math.abs(cx - centerX) - cw / 2);
                const dz = Math.max(0, Math.abs(cz - centerZ) - cd / 2);
                if (Math.hypot(dx, dz) < oculusR + 0.04) continue;
            }

            const c = new THREE.PlaneGeometry(cw, cd);
            c.rotateX(Math.PI / 2);
            c.translate(cx, COFFER_Y, cz);
            ceilingGeos.coffer.push(c);

            const ft = 0.08;
            const trims = [
                [cw, ft, cx, cz - cd / 2 + ft / 2],
                [cw, ft, cx, cz + cd / 2 - ft / 2],
                [ft, cd, cx - cw / 2 + ft / 2, cz],
                [ft, cd, cx + cw / 2 - ft / 2, cz],
            ];
            for (const [tw, td, tx, tz] of trims) {
                const t = new THREE.PlaneGeometry(tw, td);
                t.rotateX(Math.PI / 2);
                t.translate(tx, TRIM_Y, tz);
                ceilingGeos.brass.push(t);
            }
        }
    }

    if (oculusR > 0) {
        const r1 = new THREE.RingGeometry(oculusR, oculusR + 0.10, 48);
        r1.rotateX(Math.PI / 2); r1.translate(centerX, y - 0.006, centerZ);
        ceilingGeos.brass.push(r1);

        const r2 = new THREE.RingGeometry(oculusR + 0.10, oculusR + 0.34, 48);
        r2.rotateX(Math.PI / 2); r2.translate(centerX, y - 0.004, centerZ);
        ceilingGeos.ceil.push(r2);

        const r3 = new THREE.RingGeometry(oculusR + 0.34, oculusR + 0.46, 48);
        r3.rotateX(Math.PI / 2); r3.translate(centerX, y - 0.006, centerZ);
        ceilingGeos.brass.push(r3);

        const sky = new THREE.Mesh(new THREE.CircleGeometry(oculusR + 0.6, 48), skyMat);
        sky.geometry.rotateX(Math.PI / 2);
        sky.position.set(centerX, y + 1.4, centerZ);
        scene.add(sky);

        const ocLight = new THREE.PointLight(0xFFF0D0, 1.6, 26, 1.6);
        ocLight.position.set(centerX, y - 0.35, centerZ);
        scene.add(ocLight);
    }
}

function finalizeCeilings() {
    const pairs = [[ceilingGeos.ceil, ceilMat], [ceilingGeos.coffer, cofferMat], [ceilingGeos.brass, ceilBrassMat]];
    for (const [geos, mat] of pairs) {
        if (!geos.length) continue;
        const mesh = new THREE.Mesh(mergeGeometries(geos, false), mat);
        mesh.matrixAutoUpdate = false;
        scene.add(mesh);
        for (const g of geos) g.dispose();
        geos.length = 0;
    }
}

// ============================================================
// FOYER: floor inlay, pillars, wall trim
// ============================================================
function addFoyerGrandeur() {
    const FW = foyerWidth, FD = foyerDepth, WH = wallHeight;
    const hw = FW / 2, hd = FD / 2;
    const hallHalf = hallwayWidth / 2;

    const buckets = new Map();
    const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
    const _v = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);

    function pushGeo(geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
        _e.set(rx, ry, rz);
        _q.setFromEuler(_e);
        _v.set(x, y, z);
        _m.compose(_v, _q, _s);
        geo.applyMatrix4(_m);
        let b = buckets.get(mat.uuid);
        if (!b) { b = { mat, geos: [] }; buckets.set(mat.uuid, b); }
        b.geos.push(geo);
    }

    const PLANE = (w, h) => new THREE.PlaneGeometry(w, h);
    const CYL = (rt, rb, h, s = 20) => new THREE.CylinderGeometry(rt, rb, h, s);
    const RING = (ri, ro, s = 48) => new THREE.RingGeometry(ri, ro, s);

    // ----- FLOOR INLAY -----
    const FY = 0.02;
    {
        const inset = 1.6, iw = FW - inset * 2, id = FD - inset * 2, bw = 0.15;
        for (const z of [-id / 2, id / 2]) { const g = PLANE(iw, bw); g.rotateX(-Math.PI / 2); pushGeo(g, brassMat, 0, FY, z); }
        for (const x of [-iw / 2, iw / 2]) { const g = PLANE(bw, id); g.rotateX(-Math.PI / 2); pushGeo(g, brassMat, x, FY, 0); }
    }
    {
        const inset = 2.05, iw = FW - inset * 2, id = FD - inset * 2, bw = 0.35;
        for (const z of [-id / 2, id / 2]) { const g = PLANE(iw, bw); g.rotateX(-Math.PI / 2); pushGeo(g, trimMatPanel, 0, FY - 0.003, z); }
        for (const x of [-iw / 2, iw / 2]) { const g = PLANE(bw, id); g.rotateX(-Math.PI / 2); pushGeo(g, trimMatPanel, x, FY - 0.003, 0); }
    }
    {
        const medR = 5.5;
        const ringG = RING(2.85, medR); ringG.rotateX(-Math.PI / 2);
        pushGeo(ringG, inlayMat, 0, FY - 0.004, 0);

        const br1 = RING(medR, medR + 0.08); br1.rotateX(-Math.PI / 2);
        pushGeo(br1, brassMat, 0, FY + 0.003, 0);

        const br2 = RING(2.78, 2.86); br2.rotateX(-Math.PI / 2);
        pushGeo(br2, brassMat, 0, FY + 0.003, 0);

        // Radial spokes. (Old version rotated these by `a` instead of PI/2 - a,
        // so they weren't actually pointing away from the centre.)
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            const len = medR - 2.9;
            const g = PLANE(0.08, len); g.rotateX(-Math.PI / 2);
            const cx = Math.cos(a) * (2.9 + len / 2);
            const cz = Math.sin(a) * (2.9 + len / 2);
            pushGeo(g, brassMat, cx, FY + 0.002, cz, 0, Math.PI / 2 - a, 0);
        }
    }

    // ----- PILLAR BASES / CAPITALS -----
    const pillarH = WH - 0.3;
    for (const [px, pz] of [[-6.5, -5.5], [6.5, -5.5], [-6.5, 5.5], [6.5, 5.5]]) {
        pushGeo(CYL(0.60, 0.64, 0.14), trimMatPanel, px, 0.07, pz);
        pushGeo(CYL(0.56, 0.58, 0.06), marbleMat, px, 0.17, pz);
        pushGeo(CYL(0.50, 0.52, 0.05), brassMat, px, 0.225, pz);
        pushGeo(CYL(0.46, 0.46, 0.05), brassMat, px, pillarH - 0.30, pz);
        pushGeo(CYL(0.62, 0.46, 0.14), marbleMat, px, pillarH - 0.20, pz);
        pushGeo(CYL(0.64, 0.62, 0.05), trimMatPanel, px, pillarH - 0.105, pz);
        pushGeo(BOX(1.30, 0.10, 1.30), marbleMat, px, pillarH - 0.03, pz);
    }

    // ----- WALL TRIM -----
    trimChunk = 'foyer';
    {
        // North wall split around the hallway opening
        const secL = hw - hallHalf;
        buildTrimmedWall({ wallX: 0, wallZ: -hd, wallRotY: 0, wallLen: secL, offsetAlong: -(hallHalf + secL / 2) });
        buildTrimmedWall({ wallX: 0, wallZ: -hd, wallRotY: 0, wallLen: secL, offsetAlong:   hallHalf + secL / 2 });
    }
    buildTrimmedWall({ wallX: 0,   wallZ:  hd, wallRotY:  Math.PI,     wallLen: FW });
    buildTrimmedWall({ wallX: -hw, wallZ: 0,   wallRotY:  Math.PI / 2, wallLen: FD });
    buildTrimmedWall({ wallX:  hw, wallZ: 0,   wallRotY: -Math.PI / 2, wallLen: FD });

    // ----- MERGE -----
    const group = new THREE.Group();
    group.name = 'FoyerGrandeur';
    for (const { mat, geos } of buckets.values()) {
        const merged = mergeGeometries(geos, false);
        if (merged) {
            const mesh = new THREE.Mesh(merged, mat);
            mesh.matrixAutoUpdate = false;
            group.add(mesh);
        }
        for (const g of geos) g.dispose();
    }
    scene.add(group);
}

// ============================================================
// FOUNTAIN
// ============================================================
{
    const fountainGroup = new THREE.Group();

    const basin = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.8, 1.2, 16),
        new THREE.MeshStandardMaterial({ color: 0xDCD2C4, roughness: 0.6 })
    );
    basin.position.y = 0.6;
    fountainGroup.add(basin);

    const water = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 0.1, 16),
        new THREE.MeshStandardMaterial({ color: 0x3A6B8A, roughness: 0.2, metalness: 0.3, transparent: true, opacity: 0.8 })
    );
    water.position.y = 1.2;
    fountainGroup.add(water);

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 1.5, 8), marbleMat);
    pedestal.position.y = 1.95;
    fountainGroup.add(pedestal);

    const statueMat = new THREE.MeshStandardMaterial({ color: 0xEDE6DC, roughness: 0.5 });
    const statueBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.8, 8), statueMat);
    statueBody.position.y = 3.6;
    fountainGroup.add(statueBody);

    const statueHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), statueMat);
    statueHead.position.y = 4.7;
    fountainGroup.add(statueHead);

    scene.add(fountainGroup);

    obstacles.push(new THREE.Box3(
        new THREE.Vector3(-2.8, 0, -2.8),
        new THREE.Vector3(2.8, 4.8, 2.8)
    ));
}

// ============================================================
// FLOORS / CEILING SLABS / FOYER WALLS
// ============================================================
addBox(foyerWidth, 0.2, foyerDepth, 0, -0.1, foyerCenterZ, floorMat, false);
addBox(hallwayWidth, 0.2, hallwayLength, 0, -0.1, hallwayCenterZ, floorMat, false);
addBox(foyerWidth, 0.2, foyerDepth, 0, wallHeight, foyerCenterZ, floorMat, false);
addBox(hallwayWidth, 0.2, hallwayLength, 0, wallHeight, hallwayCenterZ, floorMat, false);

// Back wall (opposite the hallway)
addBox(foyerWidth, wallHeight, wallThickness, 0, wallHeight / 2, foyerDepth / 2, wallMat);
// Side walls
addBox(wallThickness, wallHeight, foyerDepth, -foyerWidth / 2, wallHeight / 2, foyerCenterZ, wallMat);
addBox(wallThickness, wallHeight, foyerDepth,  foyerWidth / 2, wallHeight / 2, foyerCenterZ, wallMat);

// North wall on either side of the hallway opening.
// (This wall was missing: the trim was being drawn for it, but there was no
// wall behind it, so you could see straight into the void.)
{
    const secL = foyerWidth / 2 - hallwayWidth / 2;
    const cx = hallwayWidth / 2 + secL / 2;
    addBox(secL, wallHeight, wallThickness, -cx, wallHeight / 2, -foyerDepth / 2, wallMat);
    addBox(secL, wallHeight, wallThickness,  cx, wallHeight / 2, -foyerDepth / 2, wallMat);
}

// Foyer pillars
function addPillar(x, z, radius = 0.35) {
    const height = wallHeight - 0.3;
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.2, height, 16), marbleMat);
    pillar.position.set(x, height / 2, z);
    scene.add(pillar);

    const cr = radius * 1.15;
    obstacles.push(new THREE.Box3(
        new THREE.Vector3(x - cr, 0, z - cr),
        new THREE.Vector3(x + cr, height, z + cr)
    ));
}
addPillar(-6.5, -5.5);
addPillar(6.5, -5.5);
addPillar(-6.5, 5.5);
addPillar(6.5, 5.5);

addFoyerGrandeur();

addCofferedCeiling({ centerX: 0, centerZ: foyerCenterZ, width: foyerWidth, depth: foyerDepth, oculusR: 1.75, cellSize: 4.0 });
addCofferedCeiling({ centerX: 0, centerZ: hallwayCenterZ, width: hallwayWidth, depth: hallwayLength, cellSize: 3.0 });

// ============================================================
// GOTHIC ARCHWAY
// ============================================================
function addGothicArchway(options = {}) {
    const {
        centerX,
        centerZ,
        axis = 'x',
        openingWidth = doorWidth,
        wallHeight: H = wallHeight,
        wallThickness: T = wallThickness,
        trimWidth = archTrimWidth,
        projection = 0.36,
    } = options;

    const W = openingWidth;
    const hw = W / 2;
    const springY = options.springY ?? 2.6;
    const peakY = options.peakY ?? Math.min(4.6, H - 1.0);

    // 1. Spandrel / header wall
    const wallShape = new THREE.Shape();
    wallShape.moveTo(-hw - trimWidth, springY);
    wallShape.lineTo(-hw - trimWidth, H);
    wallShape.lineTo(hw + trimWidth, H);
    wallShape.lineTo(hw + trimWidth, springY);
    wallShape.quadraticCurveTo(hw + trimWidth, peakY + trimWidth, 0, peakY + trimWidth);
    wallShape.quadraticCurveTo(-hw - trimWidth, peakY + trimWidth, -hw - trimWidth, springY);
    wallShape.closePath();

    const wallGeo = new THREE.ExtrudeGeometry(wallShape, { depth: T * 0.6, bevelEnabled: false, curveSegments: 12 });
    wallGeo.translate(0, 0, -T * 0.3);
    if (axis === 'x') wallGeo.rotateY(Math.PI / 2);
    wallGeo.translate(centerX, 0, centerZ);
    scene.add(new THREE.Mesh(wallGeo, wallMat));

    // Solid header above the arch (with collision)
    const headerH = H - (peakY + trimWidth);
    const headerY = (peakY + trimWidth) + headerH / 2;
    if (axis === 'x') addBox(T, headerH, W + trimWidth * 2, centerX, headerY, centerZ, wallMat, true);
    else              addBox(W + trimWidth * 2, headerH, T, centerX, headerY, centerZ, wallMat, true);

    // 2. Marble arch trim
    const outer = new THREE.Shape();
    outer.moveTo(-hw - trimWidth, 0);
    outer.lineTo(-hw - trimWidth, springY);
    outer.quadraticCurveTo(-hw - trimWidth, peakY + trimWidth, 0, peakY + trimWidth);
    outer.quadraticCurveTo(hw + trimWidth, peakY + trimWidth, hw + trimWidth, springY);
    outer.lineTo(hw + trimWidth, 0);
    outer.closePath();

    const hole = new THREE.Path();
    hole.moveTo(hw, 0);
    hole.lineTo(hw, springY);
    hole.quadraticCurveTo(hw, peakY, 0, peakY);
    hole.quadraticCurveTo(-hw, peakY, -hw, springY);
    hole.lineTo(-hw, 0);
    hole.closePath();
    outer.holes.push(hole);

    const archGeo = new THREE.ExtrudeGeometry(outer, { depth: projection, bevelEnabled: false, curveSegments: 12 });
    archGeo.translate(0, 0, -projection / 2);
    if (axis === 'x') archGeo.rotateY(Math.PI / 2);
    archGeo.translate(centerX, 0, centerZ);
    scene.add(new THREE.Mesh(archGeo, marbleMat));

    // 3. Keystone
    {
        const kw = axis === 'x' ? projection + 0.10 : 0.28;
        const kd = axis === 'x' ? 0.28 : projection + 0.10;
        const key = new THREE.Mesh(new THREE.BoxGeometry(kw, 0.28, kd), brassMat);
        key.position.set(centerX, peakY + trimWidth * 0.42, centerZ);
        scene.add(key);
    }

    // 4. Springing bosses
    const bossGeo = new THREE.SphereGeometry(0.085, 8, 6);
    for (const sign of [-1, 1]) {
        let px = centerX, pz = centerZ;
        if (axis === 'x') pz = centerZ + sign * (hw + trimWidth * 0.5);
        else              px = centerX + sign * (hw + trimWidth * 0.5);
        const boss = new THREE.Mesh(bossGeo, brassMat);
        boss.position.set(px, springY, pz);
        scene.add(boss);
    }
}

// ============================================================
// HALLWAY WALLS
// ============================================================
function addWallSegment(x, zA, zB) {
    const zStart = Math.min(zA, zB);
    const zEnd = Math.max(zA, zB);
    const length = zEnd - zStart;
    if (length <= 0) return;
    addBox(wallThickness, wallHeight, length, x, wallHeight / 2, (zStart + zEnd) / 2, wallMat, true);
}

const z0 = hallwayStartZ;
const z1 = room1Z + doorWidth / 2;
const z2 = room1Z - doorWidth / 2;
const z3 = room2Z + doorWidth / 2;
const z4 = room2Z - doorWidth / 2;
const z5 = hallwayStartZ - hallwayLength;

for (const x of [hallwayLeftX, hallwayRightX]) {
    addWallSegment(x, z0, z1);
    addWallSegment(x, z2, z3);
    addWallSegment(x, z4, z5);
}

// Hallway end wall (the hallway used to just open into the void)
addBox(hallwayWidth + wallThickness, wallHeight, wallThickness, 0, wallHeight / 2, z5, wallMat, true);

// Hallway trim: cornice continuous over every doorway, lower trim between doors
trimChunk = 'hall';
trimZWall({ x: hallwayLeftX,  facing:  1, zMin: z5, zMax: z0, doors: [room1Z, room2Z] });
trimZWall({ x: hallwayRightX, facing: -1, zMin: z5, zMax: z0, doors: [room3Z, room4Z] });
buildTrimmedWall({ wallX: 0, wallZ: z5, wallRotY: 0, wallLen: hallwayWidth });

// ============================================================
// GALLERY ROOMS
// ============================================================
function addRoomSign(text, x, z, side) {
    const signY = wallHeight - 1.75;

    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.55, 0.12), brassMat);
    signBoard.position.set(x, signY, z);

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8A6B3D';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#C4A86A';
    ctx.lineWidth = 12;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 88px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const signText = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 0.45),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), side: THREE.DoubleSide })
    );
    signText.position.set(x, signY, z);

    if (side === 'left') {
        signBoard.rotation.y = Math.PI / 2;
        signText.rotation.y = Math.PI / 2;
        signText.position.x += 0.08;
    } else {
        signBoard.rotation.y = -Math.PI / 2;
        signText.rotation.y = -Math.PI / 2;
        signText.position.x -= 0.08;
    }
    scene.add(signBoard, signText);
}

// ----- Lazy picture loading -----
// Pictures no longer all load at startup. Each room registers its picture
// materials here and they load (two at a time) once you walk near the room.
const lazyRooms = [];
const textureQueue = [];
const texLoader = new THREE.TextureLoader();
let activeLoads = 0;

function pumpTextureQueue() {
    while (activeLoads < 2 && textureQueue.length) {
        const { mat, url } = textureQueue.shift();
        activeLoads++;
        texLoader.load(
            url.trim(),
            (tex) => {
                tex.anisotropy = 4;
                mat.map = tex;
                mat.color.set(0xffffff);
                mat.needsUpdate = true;
                activeLoads--;
                pumpTextureQueue();
            },
            undefined,
            () => { activeLoads--; pumpTextureQueue(); }
        );
    }
}

function updateLazyRooms() {
    let dirty = false;
    for (const room of lazyRooms) {
        if (room.started) continue;
        if (Math.hypot(camera.position.x - room.x, camera.position.z - room.z) < ROOM_LOAD_RADIUS) {
            room.started = true;
            textureQueue.push(...room.items);
            dirty = true;
        }
    }
    if (dirty) pumpTextureQueue();
}

// Shared geometries / materials for pictures
const imageGeoCache = new Map();
const getImageGeo = (w, h) => {
    const k = w + 'x' + h;
    let g = imageGeoCache.get(k);
    if (!g) { g = new THREE.PlaneGeometry(w, h); imageGeoCache.set(k, g); }
    return g;
};
const plaqueGeo = new THREE.PlaneGeometry(1.6, 0.7);
const plaqueMatCache = new Map();
const getPlaqueMat = (title, date, desc) => {
    const k = title + '|' + date + '|' + desc;
    let m = plaqueMatCache.get(k);
    if (!m) {
        m = new THREE.MeshStandardMaterial({ map: createPlaqueTexture(title, date, desc), side: THREE.DoubleSide });
        plaqueMatCache.set(k, m);   // blank plaques all share ONE texture
    }
    return m;
};

function addRoom({ centerX, centerZ, doorZ, side, name, pictures = [] }) {
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);
    const isLeftRoom = side === 'left';
    trimChunk = 'room:' + name;

    const outerX = centerX + (isLeftRoom ? -roomWidth / 2 : roomWidth / 2);
    const innerX = centerX + (isLeftRoom ? roomWidth / 2 : -roomWidth / 2);
    const roomMinZ = centerZ - roomDepth / 2;
    const roomMaxZ = centerZ + roomDepth / 2;

    // Floor / ceiling slabs
    addBox(roomWidth, 0.2, roomDepth, centerX, -0.1, centerZ, floorMat, false);
    addBox(roomWidth, 0.2, roomDepth, centerX, wallHeight, centerZ, floorMat, false);

    // ----- WALL TRIM -----
    // Far wall
    buildTrimmedWall({
        wallX: outerX, wallZ: centerZ,
        wallRotY: isLeftRoom ? Math.PI / 2 : -Math.PI / 2,
        wallLen: roomDepth,
    });
    // Two long side walls
    buildTrimmedWall({ wallX: centerX, wallZ: roomMinZ, wallRotY: 0,       wallLen: roomWidth });
    buildTrimmedWall({ wallX: centerX, wallZ: roomMaxZ, wallRotY: Math.PI, wallLen: roomWidth });
    // Door wall (room side): cornice straight across, lower trim stops at the arch frame
    trimZWall({ x: innerX, facing: isLeftRoom ? -1 : 1, zMin: roomMinZ, zMax: roomMaxZ, doors: [doorZ] });

    addCofferedCeiling({ centerX, centerZ, width: roomWidth, depth: roomDepth, cellSize: 3.5 });

    // ----- WALLS -----
    addBox(wallThickness, wallHeight, roomDepth, outerX, wallHeight / 2, centerZ, wallMat, true);
    addBox(roomWidth, wallHeight, wallThickness, centerX, wallHeight / 2, roomMaxZ, wallMat, true);
    addBox(roomWidth, wallHeight, wallThickness, centerX, wallHeight / 2, roomMinZ, wallMat, true);
    // (The door wall at innerX is the hallway wall — it's already built by the
    // hallway code. It used to be built a second time here on top of itself.)

    // ----- SIGN -----
    addRoomSign(name, innerX + (isLeftRoom ? 0.18 : -0.18), doorZ, side);

    // ----- PICTURE GALLERY -----
    if (pictures.length === 0) return;

    const frameW = 1.8, frameH = 2.4;
    const imageW = 1.6, imageH = 2.2;
    const plaqueW = 1.6, plaqueH = 0.7;
    const spacing = 3;
    const wallOffset = 0.15;

    const farWallMax = 2;
    const leftWallMax = 10;
    const rightWallMax = 10;

    // Which absolute Z wall is the player's left / right when walking in
    const facingX = isLeftRoom ? -1 : 1;
    const rightWallZ = facingX > 0 ? roomMaxZ : roomMinZ;
    const leftWallZ = facingX > 0 ? roomMinZ : roomMaxZ;

    const rotationForWall = (wallZ) => (wallZ > centerZ ? Math.PI : 0);
    const inwardOffset = (wallZ) => (wallZ > centerZ ? -wallOffset : wallOffset);

    const frameGeos = [];     // merged into one brass mesh at the end
    const lazyItems = [];

    const createGalleryPicture = (imgData, position, rotationY) => {
        const isLandscape = imgData.orientation === 'landscape';
        const cFrameW = isLandscape ? frameH : frameW;
        const cFrameH = isLandscape ? frameW : frameH;
        const cImageW = isLandscape ? imageH : imageW;
        const cImageH = isLandscape ? imageW : imageH;

        // Frame (merged later)
        const fg = new THREE.BoxGeometry(cFrameW, cFrameH, 0.08);
        fg.rotateY(rotationY);
        fg.translate(position.x, position.y, position.z);
        frameGeos.push(fg);

        // Image (texture arrives lazily)
        const imgMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.7,
            metalness: 0.1,
            side: THREE.DoubleSide,
        });
        if (imgData.img) lazyItems.push({ mat: imgMaterial, url: imgData.img });

        const imgPlane = new THREE.Mesh(getImageGeo(cImageW, cImageH), imgMaterial);
        imgPlane.position.copy(position);
        imgPlane.rotation.y = rotationY;

        if (Math.abs(rotationY - Math.PI) < 0.01) imgPlane.position.z -= 0.05;
        else if (Math.abs(rotationY) < 0.01)       imgPlane.position.z += 0.05;
        else if (rotationY < 0)                    imgPlane.position.x -= 0.05;
        else                                       imgPlane.position.x += 0.05;
        roomGroup.add(imgPlane);

        // Plaque
        const plaque = new THREE.Mesh(
            plaqueGeo,
            getPlaqueMat(imgData.title || '', imgData.date || '', imgData.desc || '')
        );
        plaque.position.copy(position);
        plaque.position.y -= cFrameH / 2 + plaqueH / 2 + 0.15;
        plaque.rotation.y = rotationY;

        if (Math.abs(rotationY - Math.PI) < 0.01) plaque.position.z -= 0.05;
        else if (rotationY < 0)                   plaque.position.x -= 0.05;
        else                                      plaque.position.x += 0.05;
        roomGroup.add(plaque);
    };

    // FAR WALL
    const farPictures = pictures.slice(0, farWallMax);
    const farStartZ = centerZ - (farPictures.length - 1) * spacing / 2;
    const farRotationY = isLeftRoom ? Math.PI / 2 : -Math.PI / 2;
    const farOffset = isLeftRoom ? wallOffset : -wallOffset;
    farPictures.forEach((p, i) => {
        createGalleryPicture(p, new THREE.Vector3(outerX + farOffset, 2.5, farStartZ + i * spacing), farRotationY);
    });

    // LEFT WALL
    const leftPictures = pictures.slice(farWallMax, farWallMax + leftWallMax);
    const leftStartX = centerX - (leftPictures.length - 1) * spacing / 2;
    const leftRotationY = rotationForWall(leftWallZ);
    const leftOffset = inwardOffset(leftWallZ);
    leftPictures.forEach((p, i) => {
        createGalleryPicture(p, new THREE.Vector3(leftStartX + i * spacing, 2.5, leftWallZ + leftOffset), leftRotationY);
    });

    // RIGHT WALL
    const rightPictures = pictures.slice(farWallMax + leftWallMax, farWallMax + leftWallMax + rightWallMax);
    const rightStartX = centerX - (rightPictures.length - 1) * spacing / 2;
    const rightRotationY = rotationForWall(rightWallZ);
    const rightOffset = inwardOffset(rightWallZ);
    rightPictures.forEach((p, i) => {
        createGalleryPicture(p, new THREE.Vector3(rightStartX + i * spacing, 2.5, rightWallZ + rightOffset), rightRotationY);
    });

    // Merge every frame in this room into a single draw call
    if (frameGeos.length) {
        const merged = mergeGeometries(frameGeos, false);
        if (merged) roomGroup.add(new THREE.Mesh(merged, brassMat));
        for (const g of frameGeos) g.dispose();
    }

    lazyRooms.push({ x: centerX, z: centerZ, items: lazyItems, started: false });
}

addRoom({ centerX: -(hallwayWidth / 2 + roomWidth / 2), centerZ: room1Z, doorZ: room1Z, side: 'left',  name: 'Visions of Gaming', pictures: gamingRoomPictures });
addRoom({ centerX: -(hallwayWidth / 2 + roomWidth / 2), centerZ: room2Z, doorZ: room2Z, side: 'left',  name: 'Travels',           pictures: travelRoomPictures });
addRoom({ centerX:   hallwayWidth / 2 + roomWidth / 2,  centerZ: room3Z, doorZ: room3Z, side: 'right', name: 'Betterment',        pictures: gymRoomPictures });
addRoom({ centerX:   hallwayWidth / 2 + roomWidth / 2,  centerZ: room4Z, doorZ: room4Z, side: 'right', name: 'Gallery IV' });

// Gothic archways over each gallery doorway
[
    { centerX: hallwayLeftX,  centerZ: room1Z },
    { centerX: hallwayLeftX,  centerZ: room2Z },
    { centerX: hallwayRightX, centerZ: room3Z },
    { centerX: hallwayRightX, centerZ: room4Z },
].forEach(({ centerX, centerZ }) => addGothicArchway({ centerX, centerZ, axis: 'x' }));

// ============================================================
// UNDER CONSTRUCTION SIGN
// ============================================================
{
    const signGroup = new THREE.Group();

    const signBoard = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1.4, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.2 })
    );
    signBoard.position.set(0, 1.6, -8);
    signGroup.add(signBoard);

    const signText = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 1.1),
        new THREE.MeshStandardMaterial({
            map: createPlaqueTexture('Under Construction', '', '', false, 112),
            side: THREE.DoubleSide,
        })
    );
    signText.position.set(0, 1.6, -7.9);
    signGroup.add(signText);

    const postMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.4 });
    const postGeo = new THREE.BoxGeometry(0.12, 2.0, 0.12);
    for (const x of [-1.3, 1.3]) {
        const post = new THREE.Mesh(postGeo, postMaterial);
        post.position.set(x, 1.0, -8);
        signGroup.add(post);
    }
    scene.add(signGroup);
}

// ============================================================
// FINALIZE STATIC WORLD
// ============================================================
finalizeTrim();
finalizeCeilings();

// Nothing in the palace moves, so compute every transform ONCE and stop
// three.js from re-walking the whole scene graph every frame.
scene.traverse((o) => {
    o.updateMatrix();
    o.matrixAutoUpdate = false;
});
scene.updateMatrixWorld(true);
scene.matrixWorldAutoUpdate = false;

// ============================================================
// CONTROLS (manual)
// ============================================================
let isLocked = false;
let yaw = 0;
let pitch = 0;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const speed = 7.0;

let verticalVelocity = 0;
let onGround = true;
const gravity = -20;
const jumpStrength = 8;
const eyeHeight = 2.0;

const _euler = new THREE.Euler(0, 0, 0, 'YXZ');
function updateCameraRotation() {
    _euler.set(pitch, yaw, 0, 'YXZ');
    camera.quaternion.setFromEuler(_euler);
}
updateCameraRotation();

renderer.domElement.addEventListener('click', () => {
    if (!isLocked) document.body.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    isLocked = document.pointerLockElement === document.body;
    const instr = document.getElementById('instruction');
    if (instr) instr.style.opacity = isLocked ? '0' : '1';
});

document.addEventListener('mousemove', (event) => {
    if (!isLocked) return;
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    if (Math.abs(movementX) > 300 || Math.abs(movementY) > 300) return;

    yaw -= movementX * 0.002;
    pitch -= movementY * 0.002;
    pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
    updateCameraRotation();
});

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
const touchMove = { x: 0, y: 0 };
let isTouchingJoystick = false;
let isTouchingLook = false;
let lastTouchX = 0, lastTouchY = 0;

const joystickArea = document.getElementById('joystick-area');
const joystickKnob = document.getElementById('joystick-knob');

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
    joystickKnob.style.transform = `translate(${-50 + normX * 50}%, ${-50 + normY * 50}%)`;
}

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
    yaw -= (t.clientX - lastTouchX) * 0.005;
    pitch -= (t.clientY - lastTouchY) * 0.005;
    pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
    updateCameraRotation();
    lastTouchX = t.clientX;
    lastTouchY = t.clientY;
}, { passive: true });

document.body.addEventListener('touchend', () => { isTouchingLook = false; }, { passive: true });

// ----- COLLISION -----
const _testBox = new THREE.Box3();
const _bmin = new THREE.Vector3();
const _bmax = new THREE.Vector3();
function collidesAt(x, y, z) {
    if (NO_COLLISION) return false;
    _bmin.set(x - 0.3, y - 0.3, z - 0.3);
    _bmax.set(x + 0.3, y + 1.0, z + 0.3);
    _testBox.set(_bmin, _bmax);
    for (let i = 0; i < obstacles.length; i++) {
        if (_testBox.intersectsBox(obstacles[i])) return true;
    }
    return false;
}

function resetPosition() {
    camera.position.set(0, eyeHeight, 10);
    yaw = 0;
    pitch = 0;
    verticalVelocity = 0;
    onGround = true;
    updateCameraRotation();
}

// ============================================================
// ANIMATION LOOP  (no per-frame allocations)
// ============================================================
const clock = new THREE.Clock();
const forwardVec = new THREE.Vector3();
const rightVec = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
let lazyCheckTimer = 0;

function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);

    camera.getWorldDirection(forwardVec);
    forwardVec.y = 0;
    forwardVec.normalize();
    rightVec.crossVectors(forwardVec, UP).normalize();

    let moveX = 0, moveZ = 0;
    if (moveForward)  { moveX += forwardVec.x; moveZ += forwardVec.z; }
    if (moveBackward) { moveX -= forwardVec.x; moveZ -= forwardVec.z; }
    if (moveLeft)     { moveX -= rightVec.x;   moveZ -= rightVec.z; }
    if (moveRight)    { moveX += rightVec.x;   moveZ += rightVec.z; }

    const jx = touchMove.x, jy = touchMove.y;
    if (Math.abs(jx) > 0.1 || Math.abs(jy) > 0.1) {
        moveX += forwardVec.x * jy + rightVec.x * jx;
        moveZ += forwardVec.z * jy + rightVec.z * jx;
    }

    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (len > 0.01) {
        const step = speed * delta;
        const dx = (moveX / len) * step;
        const dz = (moveZ / len) * step;
        const p = camera.position;
        if (!collidesAt(p.x + dx, p.y, p.z + dz)) {
            p.x += dx;
            p.z += dz;
        } else {
            if (!collidesAt(p.x + dx, p.y, p.z)) p.x += dx;
            if (!collidesAt(p.x, p.y, p.z + dz)) p.z += dz;
        }
    }

    verticalVelocity += gravity * delta;
    camera.position.y += verticalVelocity * delta;
    if (camera.position.y < eyeHeight) {
        camera.position.y = eyeHeight;
        verticalVelocity = 0;
        onGround = true;
    }

    // Check which galleries are close enough to start loading (twice a second)
    lazyCheckTimer += delta;
    if (lazyCheckTimer > 0.5) {
        lazyCheckTimer = 0;
        updateLazyRooms();
    }

    renderer.render(scene, camera);
}

animate();

// ----- RESIZE & LOADING -----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Hide the loading screen as soon as the first frames are on screen
requestAnimationFrame(() => requestAnimationFrame(() => {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
}));

window.resetPosition = resetPosition;

console.log('🏛️ Memory Palace loaded!');
console.log('Controls: WASD + mouse (click to lock) | Mobile: joystick + drag to look');
console.log('Press R to reset position.');