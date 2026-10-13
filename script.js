// ============================================================
// Lukas Palubiski — pixel nature background with day/night cycle
// ============================================================

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ------------------------------------------------------------
  // PALETTES
  // ------------------------------------------------------------
  const NIGHT_PALETTE = {
    skyTop: '#0E2418',
    skyBottom: '#1B4332',
    ground: '#12261B',
    trunkDark: '#3A2A1B',
    trunkLight: '#4E3826',
    trunkKnot: '#241A10',
    star: '#95D5B2',
    pine: ['#123625', '#1B4332', '#2D6A4F'],
    round: ['#2D6A4F', '#3F8361', '#74A57F'],
    logDark: '#2A1B10',
    logLight: '#4E3826',
    flame: ['#7A1E0E', '#C1440E', '#E8720C', '#F2A93C', '#FBD97A'],
    sparkHot: '#FFD166',
    sparkCool: '#FF8B3D',
    glow: 'rgba(255,170,80,',
    smoke: '#A0A0A0'
  };

  const DAY_PALETTE = {
  skyTop: '#6BB3E0',        // Slightly deeper blue
  skyBottom: '#C8E6C9',      // Greenish-tinted sky near horizon (grass reflection)
  ground: '#5D8A3C',         // RICH GRASS GREEN (was #4CAF50)
  trunkDark: '#5D4037',
  trunkLight: '#795548',
  trunkKnot: '#3E2723',
  star: '#FFD700',
  pine: ['#3E8E41', '#4CAF50', '#66BB6A'],
  round: ['#43A047', '#66BB6A', '#81C784'],
  logDark: '#5D4037',
  logLight: '#8D6E63',
  flame: [],
  sparkHot: '',
  sparkCool: '',
  glow: '',
  smoke: '#C8C8C8'
};

  let palette = DAY_PALETTE;   // start at night
  let isNight = false;

  // ------------------------------------------------------------
  // CONFIG
  // ------------------------------------------------------------
  const PIXEL_SCALE = 6;
  const FIRE_POSITION_RATIO = 0.87;
  const FIRE_CLEARING_RADIUS = 16;

  let width = 0;
  let height = 0;
  let trees = [];
  let stars = [];
  let fire = null;
  let sparks = [];
  let fireFlicker = 0;
  let grassDetails = [];
  let clouds = [];

  // ------------------------------------------------------------
  // UTILITY
  // ------------------------------------------------------------
  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

      function buildCanopyBlocks(species, baseWidth, canopyHeight, rand) {
    const blocks = [];
    const blockSize = 3;

    // Ensure rows are completely filled vertically by stepping by blockSize
    const rowCount = Math.ceil(canopyHeight / blockSize) + 1;

    for (let i = 0; i < rowCount; i++) {
      const t = i / (rowCount - 1);
      let widthFactor;
      if (species === 'pine') {
        // CORRECTED: Wide at the bottom, narrow at the top
        widthFactor = 0.1 + t * 0.6;
      } else {
        widthFactor = Math.sin(t * Math.PI);
      }
      
      // SOLID row width (no random jitter breaking the row apart)
      const rowWidth = Math.max(blockSize, baseWidth * widthFactor);
      
      // Stepping by blockSize ensures no vertical gaps
      const rowY = i * blockSize; 
      
      // Top of the tree sways more (better physics)
      const swayWeight = t * 1.5 + 0.35;

      for (let x = -rowWidth / 2; x <= rowWidth / 2; x += blockSize) {
        const edgeBias = x > rowWidth * 0.1 ? 0.25 : 0;
        const topBias = (1 - t) * 0.2;
        const roll = rand() - edgeBias - topBias;
        let shade;
        if (roll < 0.28) shade = 2;
        else if (roll < 0.62) shade = 1;
        else shade = 0;

        blocks.push({
          relX: x,
          relY: rowY,
          size: blockSize,
          shade,
          swayWeight
        });
      }
    }
    return blocks;
  }

  // ------------------------------------------------------------
  // SCENE GENERATION
  // ------------------------------------------------------------
    function generateScene() {
    trees = [];
    const rand = seededRandom(42);
    const groundY = height * 0.82;
    const fireX = width * FIRE_POSITION_RATIO;
    const treeCount = Math.max(8, Math.floor(width / 16));

    for (let i = 0; i < treeCount; i++) {
      const x = (width / treeCount) * i + rand() * (width / treeCount);
      if (Math.abs(x - fireX) < FIRE_CLEARING_RADIUS) continue;

      const species = rand() < 0.5 ? 'pine' : 'round';
      
      // *** REDWOOD TREE PARAMETERS ***
      // Taller trunk, thicker, taller canopy, narrower base width
            const trunkHeight = species === 'pine' ? 32 + rand() * 24 : 12 + rand() * 14;
      const trunkWidth = species === 'pine' ? 4 + Math.floor(rand() * 2) : 3 + Math.floor(rand() * 2);
      const canopyHeight = species === 'pine' ? 70 + rand() * 30 : 20 + rand() * 12;
      
      // UPDATE THIS LINE TO MAKE IT WIDER AT THE BASE
      const baseCanopyWidth = species === 'pine' ? 24 + rand() * 10 : 22 + rand() * 12; 
      const depth = rand();
      const swayPhase = rand() * Math.PI * 2;
      const swaySpeed = 0.6 + rand() * 0.5;

      const canopyBlocks = buildCanopyBlocks(species, baseCanopyWidth, canopyHeight, rand);

      const branchCount = 1 + Math.floor(rand() * 2);
      const branches = [];
      for (let b = 0; b < branchCount; b++) {
        branches.push({
          relY: -trunkHeight * (0.3 + rand() * 0.5),
          length: 3 + Math.floor(rand() * 3),
          side: rand() < 0.5 ? -1 : 1
        });
      }

      const knotCount = Math.floor(rand() * 2);
      const knots = [];
      for (let k = 0; k < knotCount; k++) {
        knots.push({ relY: -rand() * trunkHeight });
      }

      trees.push({
        x,
        groundY: groundY - depth * 2,
        trunkHeight,
        trunkWidth,
        canopyHeight,
        depth,
        swayPhase,
        swaySpeed,
        species,
        canopyBlocks,
        branches,
        knots,
        colors: palette[species]
      });
    }

    // *** FIXED: Grass details generated OUTSIDE the tree loop ***
    grassDetails = [];
    const grassCount = isNight ? 20 : 45;
    for (let i = 0; i < grassCount; i++) {
      grassDetails.push({
        x: (i / grassCount) * width + Math.random() * 8,
        height: 1 + Math.floor(Math.random() * 2)
      });
    }

    trees.sort((a, b) => a.depth - b.depth);

    fire = {
      x: fireX,
      groundY: groundY
    };
    sparks = [];
    fireFlicker = 0;

    // *** ADD CLOUDS ***
    clouds = [];
    const cloudRand = seededRandom(99);
    const cloudCount = 5;
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: cloudRand() * width,
        y: cloudRand() * height * 0.3,
        w: 20 + Math.floor(cloudRand() * 30),
        h: 3 + Math.floor(cloudRand() * 4),
        speed: 0.02 + cloudRand() * 0.05, // Slow drift
        phase: cloudRand() * Math.PI * 2,
        puff: 2 + Math.floor(cloudRand() * 4)
      });
    }

    // stars
    stars = [];
    const starRand = seededRandom(7);
    const starCount = Math.floor((width * height) / 900);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: starRand() * width,
        y: starRand() * height * 0.55,
        phase: starRand() * Math.PI * 2
      });
    }
  }

  // ------------------------------------------------------------
  // DRAWING FUNCTIONS (use palette)
  // ------------------------------------------------------------
  function drawSky() {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, palette.skyTop);
    gradient.addColorStop(1, palette.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawStars(time) {
    if (!isNight) return;
    stars.forEach((s) => {
      const twinkle = 0.5 + 0.5 * Math.sin(time * 0.002 + s.phase);
      ctx.globalAlpha = 0.25 + twinkle * 0.35;
      ctx.fillStyle = palette.star;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1);
    });
    ctx.globalAlpha = 1;
  }
    function drawClouds(time) {
    // Subtle opacity depending on the time of day
    ctx.globalAlpha = isNight ? 0.15 : 0.4;
    ctx.fillStyle = isNight ? '#95D5B2' : '#FFFFFF';
    
    clouds.forEach((c) => {
      // Gentle bobbing effect for liveliness
      const bob = Math.sin(time * 0.001 + c.phase) * 0.2;
      
      // Draw a chunky pixelated cloud (multiple overlapping rectangles)
      for (let i = 0; i < c.puff; i++) {
        ctx.fillRect(
          Math.round(c.x + i * 6),
          Math.round(c.y + bob),
          Math.round(c.w / (i + 1)),
          c.h
        );
      }
    });
    
    ctx.globalAlpha = 1;
  }

  function drawGround() {
  const groundY = height * 0.82;
  
  if (isNight) {
    ctx.fillStyle = palette.ground;
    ctx.fillRect(0, groundY, width, height - groundY);
  } else {
    // Day: gradient from lighter grass to darker grass
    const gradient = ctx.createLinearGradient(0, groundY, 0, height);
    gradient.addColorStop(0, '#7CB342');   // Top of grass - bright
    gradient.addColorStop(0.3, '#5D8A3C'); // Mid
    gradient.addColorStop(1, '#3E6B2A');   // Bottom - darker
    ctx.fillStyle = gradient;
    ctx.fillRect(0, groundY, width, height - groundY);
  }
}

  function drawGrassDetails() {
  const groundY = height * 0.82;

  if (isNight) {
    // Night: Use a lighter green for subtle moonlit reflection
    ctx.globalAlpha = 0.4; // Was 0.1
    ctx.fillStyle = '#2D6A4F'; // Much lighter against #12261B ground
    grassDetails.forEach((g) => {
      ctx.fillRect(Math.round(g.x), groundY - 1, 2, 1);
    });
    // Add a few darker shadow spots
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000000';
    grassDetails.slice(0, 10).forEach((g) => {
      ctx.fillRect(Math.round(g.x + 2), groundY - 1, 2, 1);
    });
    ctx.globalAlpha = 1;
  } else {
    // Day: Bright pale green highlights and dark green shadows
    // Highlight
    ctx.globalAlpha = 0.8; // Was 0.3
    ctx.fillStyle = '#AED581'; // Light pale green
    grassDetails.forEach((g) => {
      ctx.fillRect(Math.round(g.x), groundY - g.height, 1, g.height);
    });
    // Shadow
    ctx.globalAlpha = 0.5; 
    ctx.fillStyle = '#33691E'; // Dark forest green
    grassDetails.slice(0, 15).forEach((g) => {
      ctx.fillRect(Math.round(g.x + 1), groundY - g.height, 1, g.height);
    });
    ctx.globalAlpha = 1;
  }
}
  function gustFactor(time) {
    return 0.5 + 0.5 * Math.sin(time * 0.0004);
  }

  function drawTree(tree, time) {
    const gust = gustFactor(time);
    const sway = Math.sin(time * 0.001 * tree.swaySpeed + tree.swayPhase);

    const trunkX = Math.round(tree.x);
    const trunkTop = tree.groundY - tree.trunkHeight;
    const trunkSwayPx =0;

    // shadow
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#000000';
    ctx.fillRect(
      Math.round(trunkX - tree.trunkWidth * 1.6),
      Math.round(tree.groundY),
      Math.round(tree.trunkWidth * 3.2),
      2
    );
    ctx.globalAlpha = 1;

    // trunk
    ctx.fillStyle = palette.trunkDark;
    ctx.fillRect(
      Math.round(trunkX - tree.trunkWidth / 2 + trunkSwayPx),
      Math.round(trunkTop),
      tree.trunkWidth,
      tree.trunkHeight
    );
    ctx.fillStyle = palette.trunkLight;
    ctx.fillRect(
      Math.round(trunkX - tree.trunkWidth / 2 + trunkSwayPx),
      Math.round(trunkTop),
      1,
      tree.trunkHeight
    );

    // knots
    ctx.fillStyle = palette.trunkKnot;
    tree.knots.forEach((k) => {
      ctx.fillRect(
        Math.round(trunkX + trunkSwayPx),
        Math.round(tree.groundY + k.relY),
        1,
        1
      );
    });

    // branches
    ctx.fillStyle = palette.trunkDark;
    tree.branches.forEach((b) => {
      const branchSway = sway * gust * 0.8;
      const by = Math.round(tree.groundY + b.relY);
      const bx = Math.round(trunkX + trunkSwayPx);
      ctx.fillRect(
        b.side > 0 ? bx : bx - b.length,
        by,
        b.length,
        1
      );
      ctx.fillRect(
        Math.round((b.side > 0 ? bx + b.length : bx - b.length) + branchSway),
        by + 1,
        1,
        1
      );
    });

    // canopy
    const canopyBottomY = trunkTop + tree.trunkHeight * 0.25;
    const canopyTopY = canopyBottomY - tree.canopyHeight;

    tree.canopyBlocks.forEach((block) => {
      const swayAmount = block.swayWeight * sway * gust * (0.6 + tree.depth * 0.6);
      ctx.fillStyle = tree.colors[block.shade];
      ctx.fillRect(
        Math.round(trunkX + block.relX + swayAmount),
        Math.round(canopyTopY + block.relY),
        block.size,
        block.size
      );
    });
  }

  // ------------------------------------------------------------
  // FIRE / SMOKE
  // ------------------------------------------------------------
  function updateFire() {
    if (!isNight) return; // no fire flicker during day
    fireFlicker += (Math.random() - 0.5) * 0.2;
    fireFlicker *= 0.95;
  }

  function updateSparks() {
    if (!fire) return;
    const maxSparks = 40;
    if (sparks.length >= maxSparks) return;

    if (isNight) {
      // Night: sparks
      if (Math.random() < 0.25) {
        sparks.push({
          x: fire.x + (Math.random() - 0.5) * 6,
          y: fire.groundY - 4,
          vx: (Math.random() - 0.5) * 0.05,
          vy: -(0.15 + Math.random() * 0.18),
          life: 35 + Math.random() * 30,
          maxLife: 60,
          isSmoke: false
        });
      }
    } else {
      // Day: smoke
      if (Math.random() < 0.15) {
        sparks.push({
          x: fire.x + (Math.random() - 0.5) * 3,     // Tight base on the logs
          y: fire.groundY - 3,
          vx: (Math.random() - 0.5) * 0.18,          // Spreads outwards into a cone
          vy: -(0.25 + Math.random() * 0.15),        // NEGATIVE moves UP toward y=0
          life: 60 + Math.random() * 60,
          maxLife: 120,
          isSmoke: true
        });
      }
    }

    sparks.forEach((s) => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 1;
    });
    sparks = sparks.filter((s) => s.life > 0);
  }

  function drawFire(time) {
  if (!fire) return;

  const baseX = Math.round(fire.x);
  const baseY = Math.round(fire.groundY);

  // ---- ALWAYS DRAW LOGS (day AND night) ----
  ctx.fillStyle = palette.logDark;
  ctx.fillRect(baseX - 7, baseY - 2, 14, 2);
  ctx.fillStyle = palette.logLight;
  ctx.fillRect(baseX - 5, baseY - 3, 10, 1);

  if (isNight) {
    // ---- NIGHT: FIRE + GLOW + FLAMES ----
    const flicker = fireFlicker + Math.sin(time * 0.02) * 0.4;

    // glow
    const glowRadius = 22 + flicker * 3;
    const gradient = ctx.createRadialGradient(
      baseX, baseY - 6, 1,
      baseX, baseY - 6, Math.max(1, glowRadius)
    );
    gradient.addColorStop(0, palette.glow + '0.4)');
    gradient.addColorStop(1, palette.glow + '0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(baseX - glowRadius, baseY - 6 - glowRadius, glowRadius * 2, glowRadius * 2);

    // flames
    const flameRows = palette.flame.length;
    for (let i = 0; i < flameRows; i++) {
      const t = i / (flameRows - 1);
      const rowWidth = Math.max(1, 8 * (1 - t) + 1);
      const rowHeight = 3;
      const rowSway = Math.sin(time * 0.007 + i * 0.7) * (1 + t * 1.5) + flicker * (0.6 + t * 0.6);
      const rowY = baseY - 3 - i * (rowHeight - 0.5);

      ctx.fillStyle = palette.flame[i];
      ctx.fillRect(
        Math.round(baseX - rowWidth / 2 + rowSway * 0.4),
        Math.round(rowY - rowHeight),
        Math.round(rowWidth),
        rowHeight
      );
    }

    // sparks
    sparks.forEach((s) => {
      if (s.isSmoke) return;
      const alpha = Math.max(0, Math.min(1, s.life / s.maxLife));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.life > s.maxLife * 0.5 ? palette.sparkHot : palette.sparkCool;
      ctx.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
    });
    ctx.globalAlpha = 1;

  } else {
    // ---- DAY: SMOKE ONLY (logs already drawn above) ----
    // Draw smoke particles rising from the logs
    sparks.forEach((s) => {
      if (!s.isSmoke) return;
      const alpha = 0.8 + 0.9 * (s.life / s.maxLife);
      ctx.globalAlpha = alpha * 0.7;
      ctx.fillStyle = palette.smoke;
      const size = 2 + Math.floor(2 * (1 - s.life / s.maxLife));
      ctx.fillRect(Math.round(s.x), Math.round(s.y), size, size);
    });
    ctx.globalAlpha = 1;

    // Small smoke wisp at the base
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = palette.smoke;
    for (let i = 0; i < 3; i++) {
      const dx = (Math.random() - 0.5) * 6;
      const dy = -Math.random() * 4 - 1;
      ctx.fillRect(baseX + dx, baseY + dy, 2, 2);
    }
    ctx.globalAlpha = 1;
  }
}
function drawNPC(time) {
  // 1. Breathing Bob (the entire body moves up/down by 1 pixel)
  // Math.floor(time / 500) % 2 creates a step that changes every half-second
  const breathe = Math.floor(time / 500) % 2; 

  // 2. Blinking (swaps a pixel every 3 seconds)
  const blink = Math.floor(time / 3000) % 6; // 0-5, blink at 0
  const eyeHeight = blink === 0 ? 1 : 2; 

  // 3. Subtle sway (arms or head move sideways by 1 pixel)
  const sway = Math.floor(time / 800) % 2;

  // Snap to pixel grid using Math.round()
  const baseX = Math.round(npc.x);
  const baseY = Math.round(npc.y - breathe);

  // Draw Shadow
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000000';
  ctx.fillRect(baseX - 2, Math.round(npc.y), 5, 1);
  ctx.globalAlpha = 1;

  // Draw Legs (Weight shifting left and right)
  ctx.fillStyle = '#43301F'; // Brown pants
  ctx.fillRect(baseX, baseY - 2, 2, 2); // Left leg
  ctx.fillRect(baseX + 2, baseY - 2, 2, 2); // Right leg

  // Draw Body
  ctx.fillStyle = '#2D6A4F'; // Green shirt
  ctx.fillRect(baseX, baseY - 6, 4, 4);

  // Draw Head (Sways left and right slightly)
  ctx.fillStyle = '#F1EFDC'; // Skin tone
  ctx.fillRect(baseX + sway, baseY - 9, 4, 3);

  // Draw Eyes (Blinking)
  ctx.fillStyle = '#22301F'; // Eye color
  ctx.fillRect(baseX + 1 + sway, baseY - 8, 1, eyeHeight); // Left eye
  ctx.fillRect(baseX + 3 + sway, baseY - 8, 1, eyeHeight); // Right eye
}
  // ------------------------------------------------------------
  // MAIN LOOP
  // ------------------------------------------------------------
    function frame(time) {
    ctx.clearRect(0, 0, width, height);
    drawSky();
    
    // Update clouds (move them across)
    clouds.forEach((c) => {
      c.x += c.speed;
      if (c.x - c.w > width) {
        c.x = -c.w; // Wrap around to the other side
      }
    });
    
    drawClouds(time); // <--- ADD THIS
    drawStars(time);
    drawGround();
    drawGrassDetails();
    trees.forEach((tree) => drawTree(tree, time));
    
    updateFire();
    updateSparks();
    drawFire(time);
    
    requestAnimationFrame(frame);
  }

  // ------------------------------------------------------------
  // RESIZE
  // ------------------------------------------------------------
  function resize() {
    width = Math.max(1, Math.floor(window.innerWidth / PIXEL_SCALE));
    height = Math.max(1, Math.floor(window.innerHeight / PIXEL_SCALE));
    canvas.width = width;
    canvas.height = height;
    ctx.imageSmoothingEnabled = false;
    generateScene();
  }

  // ------------------------------------------------------------
  // DAY/NIGHT TOGGLE
  // ------------------------------------------------------------
    function toggleDayNight() {
    isNight = !isNight;
    palette = isNight ? NIGHT_PALETTE : DAY_PALETTE;

    trees.forEach(tree => {
        tree.colors = palette[tree.species];
    });

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.textContent = isNight ? '🌙' : '☀️';
    }

    sparks = [];
    fireFlicker = 0;

    // THIS LINE ACTIVATES THE DARK MODE CSS
    document.body.classList.toggle('night-mode', isNight);

    // Remember the choice so it carries over between pages
    try { localStorage.setItem('theme', isNight ? 'night' : 'day'); } catch (e) {}
}
  // ------------------------------------------------------------
  // WIRING
  // ------------------------------------------------------------
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);

  // Expose toggle to global so it can be called from HTML onclick
  window.toggleDayNight = toggleDayNight;

  // Add event listener to button
  document.addEventListener('DOMContentLoaded', function() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved === 'night' && !isNight) toggleDayNight();

    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleDayNight);
      btn.textContent = isNight ? '🌙' : '☀️';
    }
  });

})();

// ============================================================
// Footer year
// ============================================================
(function () {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ============================================================
// Active nav link highlighting (if nav exists)
// ============================================================
(function () {
  const sections = document.querySelectorAll('main .section[id]');
  const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const linkFor = (id) =>
    document.querySelector(`#main-nav a[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
})();

// Get elements
var modal = document.getElementById("profile-modal");
var img = document.getElementById("profile-thumb");
var modalImg = document.getElementById("modal-img");
var captionText = document.getElementById("caption");
var closeBtn = document.getElementsByClassName("close")[0];

// Profile modal only exists on the home page
if (img && modal) {

// Click on thumbnail to open modal
img.onclick = function(){
  modal.style.display = "flex"; // Uses flex to center the image
  modalImg.src = this.src; // Sets the enlarged image to the thumbnail's source
  captionText.innerHTML = this.alt; // Sets caption to alt text
}

// Click on X to close
closeBtn.onclick = function() { 
  modal.style.display = "none";
}

// Click anywhere on the dark background to close
modal.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Press ESC key to close
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape" && modal.style.display === "flex") {
    modal.style.display = "none";
  }
});

}


// ============================================================
// Terraria character walking on top of the profile photo.
// Hover it for a sword cursor, click to hit it.
// ============================================================
(function () {
  const canvas = document.getElementById('npc-canvas');
  const photo = document.getElementById('profile-thumb');
  if (!canvas || !photo) return;
  const ctx = canvas.getContext('2d');

  // Sprite sheet exported from Terraria: 25 frames of 44x54 stacked
  // vertically, facing left. Frame 0 is standing, 1 is jumping,
  // 2-15 are the walk cycle.
  const sheet = new Image();
  sheet.src = 'images/character.png';
  const FW = 44, FH = 54;
  const FEET = 52;                                   // first empty row under the feet
  const STAND = 0, JUMP = 1;
  const WALK = Array.from({ length: 14 }, (_, i) => 2 + i);
  const FRAME_MS = 75;

  const SCALE = 1;          // CSS pixels per sprite pixel
  const SPEED = 30;         // CSS pixels per second
  const GRAVITY = 700;      // CSS pixels per second squared
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const MAX_HP = 100;
  const RESPAWN_MS = 4000;
  const DEATH_MESSAGES = [
    'Lukas was slain by a visitor.',
    'Lukas was struck down by a visitor.',
    'Lukas was cut down the middle.',
    'Lukas forgot to drink a healing potion.',
    "Lukas's last words were 'check out my projects'.",
  ];
  const GIB_COLORS = ['#24124A', '#160A30', '#E82A2A', '#A01010', '#D3B659', '#F43131'];

  let dpr = 1, px = SCALE;
  function resize() {
    dpr = window.devicePixelRatio || 1;
    px = Math.max(1, Math.round(SCALE * dpr));   // whole device pixels, stays crisp
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  // Position: x along the photo's top edge, y above it (negative = in the air)
  let x = 0, y = 0, vx = 0, vy = 0, dir = 1, pauseUntil = 0, last = 0;
  let hp = MAX_HP, lastHitAt = -Infinity, blinkUntil = 0;
  let deadUntil = 0, deathMessage = '';
  const texts = [];       // floating damage numbers, relative to the photo
  const gibs = [];        // death particles, relative to the photo
  const slashes = [];     // sword slash streaks, relative to the photo
  let mouse = null;

  const inAir = () => y < 0 || vy < 0;

  // Character hitbox in viewport coordinates
  function isOver(cx, cy) {
    if (deadUntil || !sheet.complete) return false;
    const rect = photo.getBoundingClientRect();
    const left = rect.left + 4 + x;
    const feet = rect.top + 1 + y;
    return cx >= left + 5 && cx <= left + FW - 5 && cy >= feet - 50 && cy <= feet;
  }

  // Sword cursor only while hovering the character. Also re-checked every
  // frame, since the character walks under a still cursor.
  const updateCursor = () => {
    document.documentElement.classList.toggle('sword-cursor', !!mouse && isOver(mouse.x, mouse.y));
  };
  window.addEventListener('mousemove', (e) => { mouse = { x: e.clientX, y: e.clientY }; updateCursor(); });
  document.addEventListener('mouseleave', () => { mouse = null; updateCursor(); });

  // Capture phase so the hit doesn't also click the photo or a link underneath
  window.addEventListener('click', (e) => {
    if (!isOver(e.clientX, e.clientY)) return;
    e.preventDefault();
    e.stopPropagation();
    hit(e.clientX, last);
  }, true);

  function hit(clickX, now) {
    const rect = photo.getBoundingClientRect();
    const crit = Math.random() < 0.15;
    const dmg = (10 + Math.floor(Math.random() * 8)) * (crit ? 2 : 1);
    hp = Math.max(0, hp - dmg);
    lastHitAt = now;
    blinkUntil = now + 500;

    // Knocked away from the side it was hit on, with a little hop
    const centre = rect.left + 4 + x + FW / 2;
    vx = (clickX < centre ? 1 : -1) * 90;
    vy = -150;

    // Slash sweeps across the body, downward, in the direction of the swing
    const angle = (35 + Math.random() * 30 - 15) * Math.PI / 180;
    slashes.push({
      x: x + FW / 2, y: y - 26,
      dx: Math.cos(angle) * (clickX < centre ? 1 : -1), dy: Math.sin(angle),
      len: crit ? 74 : 60, width: crit ? 8 : 6,
      bow: (Math.random() < 0.5 ? -1 : 1) * 6, born: now,
    });

    texts.push({
      x: x + FW / 2 + (Math.random() * 12 - 6), y: y - 64,
      text: String(dmg), crit, born: now,
    });

    if (hp === 0) die(now);
  }

  function die(now) {
    deadUntil = now + RESPAWN_MS;
    deathMessage = DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];
    for (let i = 0; i < 28; i++) {
      gibs.push({
        x: x + 10 + Math.random() * 24, y: y - 10 - Math.random() * 36,
        vx: Math.random() * 240 - 120, vy: -60 - Math.random() * 200,
        size: 2 + Math.floor(Math.random() * 2),
        color: GIB_COLORS[Math.floor(Math.random() * GIB_COLORS.length)], born: now,
      });
    }
  }

  function respawn(rect, now) {
    deadUntil = 0;
    hp = MAX_HP;
    x = Math.random() * Math.max(0, rect.width - FW - 8);
    y = vx = vy = 0;
    blinkUntil = now + 800;
    pauseUntil = now + 600;
  }

  function drawSprite(left, bottom, facing, f) {
    const ox = Math.round(left * dpr);
    const oy = Math.round(bottom * dpr) - FEET * px;

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (facing > 0) {
      // The sheet faces left, so mirror it to walk right
      ctx.translate(ox * 2 + FW * px, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(sheet, 0, f * FH, FW, FH, ox, oy, FW * px, FH * px);
    ctx.restore();
  }

  function outlinedText(text, cx, cy, size, color) {
    ctx.font = size + 'px VT323, monospace';
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1A1014';
    ctx.strokeText(text, cx, cy);
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy);
  }

  // A pixelated streak: the front shoots across, then the tail catches up and
  // it fades. Tapered at both ends with a slight curve and a bright core.
  function drawSlash(s, baseX, baseY, age) {
    const head = Math.min(1, age / 0.08);
    const tail = Math.min(1, Math.max(0, (age - 0.05) / 0.15));
    if (head <= tail) return;

    const points = [];
    for (let t = tail; t <= head; t += 1 / s.len) {
      const along = (t - 0.5) * s.len, bow = Math.sin(Math.PI * t) * s.bow;
      points.push({
        x: Math.round((baseX + s.x + s.dx * along - s.dy * bow) / 2) * 2,
        y: Math.round((baseY + s.y + s.dy * along + s.dx * bow) / 2) * 2,
        w: Math.max(2, Math.round(s.width * Math.sin(Math.PI * t) / 2) * 2),
      });
    }

    ctx.globalAlpha = age < 0.2 ? 1 : 1 - (age - 0.2) / 0.1;
    // Dark red edge, red body, then a near-white core on top
    [['#9E0D17', 2], ['#FF3B3B', 0], ['#FFE3E3', -0.4]].forEach(([color, grow]) => {
      ctx.fillStyle = color;
      points.forEach((p) => {
        const size = grow < 0 ? Math.max(2, Math.round(p.w * -grow / 2) * 2) : p.w + grow;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      });
    });
    ctx.globalAlpha = 1;
  }

  // Health bar, damage numbers, gibs and the death message (CSS pixel space)
  function drawOverlay(rect, now) {
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const baseX = rect.left + 4, baseY = rect.top + 1;

    if (!deadUntil && hp < MAX_HP && now - lastHitAt < 3000) {
      const bx = Math.round(baseX + x + 7), by = Math.round(baseY + y - 58);
      const ratio = hp / MAX_HP;
      ctx.fillStyle = '#1A1014';
      ctx.fillRect(bx - 1, by - 1, 32, 6);
      ctx.fillStyle = '#5A1A1A';
      ctx.fillRect(bx, by, 30, 4);
      ctx.fillStyle = ratio > 0.5 ? '#4CC24C' : ratio > 0.25 ? '#E0C030' : '#E03030';
      ctx.fillRect(bx, by, Math.ceil(30 * ratio), 4);
    }

    for (let i = slashes.length - 1; i >= 0; i--) {
      const s = slashes[i], age = Math.max(0, now - s.born) / 1000;
      if (age > 0.3) { slashes.splice(i, 1); continue; }
      drawSlash(s, baseX, baseY, age);
    }

    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i], age = Math.max(0, now - t.born) / 1000;
      if (age > 1) { texts.splice(i, 1); continue; }
      // Pops up fast, then slows down and fades, like Terraria combat text
      const rise = 40 * (1 - Math.pow(1 - Math.min(age / 0.7, 1), 2));
      ctx.globalAlpha = age < 0.6 ? 1 : 1 - (age - 0.6) / 0.4;
      outlinedText(t.text, baseX + t.x, baseY + t.y - rise, t.crit ? 26 : 20, t.crit ? '#FF8C1A' : '#FF5050');
    }
    ctx.globalAlpha = 1;

    for (let i = gibs.length - 1; i >= 0; i--) {
      const g = gibs[i], age = Math.max(0, now - g.born) / 1000;
      if (age > 1.4) { gibs.splice(i, 1); continue; }
      ctx.globalAlpha = age < 1 ? 1 : 1 - (age - 1) / 0.4;
      ctx.fillStyle = g.color;
      ctx.fillRect(Math.round(baseX + g.x), Math.round(baseY + g.y), g.size, g.size);
    }
    ctx.globalAlpha = 1;

    if (deadUntil) {
      const cx = rect.left + rect.width / 2;
      const secs = Math.max(1, Math.ceil((deadUntil - now) / 1000));
      outlinedText(deathMessage, cx, rect.top - 24, 20, '#E6463C');
      outlinedText('Respawning in ' + secs + '...', cx, rect.top - 6, 18, '#F1EFDC');
    }
    ctx.restore();
  }

  function frame(time) {
    const dt = last ? Math.min((time - last) / 1000, 0.1) : 0;
    last = time;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rect = photo.getBoundingClientRect();
    const range = Math.max(0, rect.width - FW * SCALE - 8);

    if (deadUntil && time >= deadUntil) respawn(rect, time);

    // Gibs fly out and fall
    gibs.forEach((g) => { g.vy += GRAVITY * dt; g.x += g.vx * dt; g.y += g.vy * dt; });

    let walking = false;
    if (!deadUntil) {
      if (inAir() || vx) {
        // Knockback: fly back with gravity until landing on the photo
        vy += GRAVITY * dt;
        y = Math.min(0, y + vy * dt);
        x = Math.min(Math.max(x + vx * dt, 0), range);
        if (y === 0 && vy > 0) { vy = 0; vx = 0; }
      } else if (!reduceMotion && time >= pauseUntil) {
        walking = true;
        x += dir * SPEED * dt;
        if ((x <= 0 && dir < 0) || (x >= range && dir > 0)) {
          // Reached an edge: stop for a moment, then turn around
          x = Math.min(Math.max(x, 0), range);
          dir = -dir;
          pauseUntil = time + 1200 + Math.random() * 2000;
        } else if (Math.random() < dt * 0.15) {
          // Occasionally stop mid-walk to look around
          pauseUntil = time + 800 + Math.random() * 1500;
          if (Math.random() < 0.4) dir = -dir;
        }
      }
      x = Math.min(x, range);

      // Slowly heal back up after a few seconds without being hit
      if (hp < MAX_HP && time - lastHitAt > 4000) hp = Math.min(MAX_HP, hp + 25 * dt);
    }

    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
    if (!deadUntil && sheet.complete && sheet.naturalWidth && onScreen) {
      // Blink while hurt, like Terraria's immunity frames
      const hidden = time < blinkUntil && Math.floor(time / 70) % 2 === 1;
      const f = inAir() ? JUMP : walking ? WALK[Math.floor(time / FRAME_MS) % WALK.length] : STAND;
      if (!hidden) drawSprite(rect.left + 4 + x, rect.top + 1 + y, dir, f);
    }
    if (onScreen) drawOverlay(rect, time);

    updateCursor();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
