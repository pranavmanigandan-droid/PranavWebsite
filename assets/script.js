// === ANIMATED FISHIES ===
const fishContainer = document.getElementById('fish-container');

// Fish SVG designs
const fishDesigns = [
    // Fish 1: Small colorful fish
    `<svg viewBox="0 0 60 40" width="50" height="33" class="fish-svg">
        <defs>
            <linearGradient id="fish1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff80ab;stop-opacity:1" />
            </linearGradient>
        </defs>
        <polygon points="55,20 65,15 65,25" fill="#ff80ab" />
        <ellipse cx="30" cy="20" rx="18" ry="12" fill="url(#fish1)" />
        <circle cx="20" cy="17" r="2.5" fill="#fff" />
        <circle cx="19" cy="17" r="1.5" fill="#000" />
    </svg>`,
    
    // Fish 2: Orange striped fish
    `<svg viewBox="0 0 60 40" width="50" height="33" class="fish-svg">
        <defs>
            <linearGradient id="fish2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff9d54;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffb366;stop-opacity:1" />
            </linearGradient>
        </defs>
        <polygon points="55,20 65,15 65,25" fill="#ff9d54" />
        <ellipse cx="30" cy="20" rx="18" ry="12" fill="url(#fish2)" />
        <line x1="24" y1="16" x2="24" y2="24" stroke="#fff" stroke-width="1.5" opacity="0.6" />
        <line x1="32" y1="15" x2="32" y2="25" stroke="#fff" stroke-width="1.5" opacity="0.6" />
        <circle cx="20" cy="17" r="2.5" fill="#fff" />
        <circle cx="19" cy="17" r="1.5" fill="#000" />
    </svg>`,
    
    // Fish 3: Blue fish
    `<svg viewBox="0 0 60 40" width="50" height="33" class="fish-svg">
        <defs>
            <linearGradient id="fish3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4fc3f7;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#29b6f6;stop-opacity:1" />
            </linearGradient>
        </defs>
        <polygon points="55,20 65,15 65,25" fill="#29b6f6" />
        <ellipse cx="30" cy="20" rx="18" ry="12" fill="url(#fish3)" />
        <circle cx="28" cy="16" r="2" fill="#fff" opacity="0.8" />
        <circle cx="20" cy="17" r="2.5" fill="#fff" />
        <circle cx="19" cy="17" r="1.5" fill="#000" />
    </svg>`,
    
    // Fish 4: Yellow fish
    `<svg viewBox="0 0 60 40" width="50" height="33" class="fish-svg">
        <defs>
            <linearGradient id="fish4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffd54f;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffb74d;stop-opacity:1" />
            </linearGradient>
        </defs>
        <polygon points="55,20 70,18 70,22" fill="#ffb74d" />
        <ellipse cx="30" cy="20" rx="18" ry="12" fill="url(#fish4)" />
        <polygon points="12,18 6,15 6,25" fill="#ffb74d" opacity="0.7" />
        <circle cx="20" cy="17" r="2.5" fill="#fff" />
        <circle cx="19" cy="17" r="1.5" fill="#000" />
    </svg>`
];

function createFish() {
    const fish = document.createElement('div');
    fish.className = 'fish';
    
    // Random fish design
    fish.innerHTML = fishDesigns[Math.floor(Math.random() * fishDesigns.length)];
    
    // Random vertical position
    const randomY = Math.random() * window.innerHeight;
    fish.style.top = randomY + 'px';
    
    // Random animation direction and speed
    const isMovingRight = Math.random() > 0.5;
    const speed = Math.random() * 15 + 10; // 10-25 seconds
    
    if (isMovingRight) {
        fish.classList.add('swim-right');
    } else {
        fish.classList.add('swim-left');
    }
    
    fish.style.animationDuration = speed + 's';
    fish.style.animationDelay = Math.random() * 5 + 's';
    
    fishContainer.appendChild(fish);
    
    // Remove fish after animation completes to prevent memory buildup
    setTimeout(() => fish.remove(), (speed + 5) * 1000);
}

// Create new fish every 2-4 seconds
setInterval(createFish, Math.random() * 2000 + 2000);

// Initial batch of fish
for (let i = 0; i < 3; i++) {
    createFish();
}

// === SPACE INVADERS GAME ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreVal = document.getElementById('score-val');
const gameMsg = document.getElementById('game-msg');
const startBtn = document.getElementById('start-btn');

// Set canvas dimensions responsively
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(600, container.clientWidth - 40);
    const aspectRatio = 3 / 5;
    canvas.width = maxWidth;
    canvas.height = maxWidth * aspectRatio;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let score = 0;
let gameActive = false;
let bullets = [];
let enemies = [];
let gameLoopId = null;
const keys = {};

const player = { x: 0, y: 0, w: 30, h: 30, speed: 6 };

window.addEventListener('keydown', e => {
    if (["Space", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
    if (e.code === 'Space' && gameActive) shootBullet();
});
window.addEventListener('keyup', e => keys[e.code] = false);

function shootBullet() {
    if (bullets.length < 8) {
        bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 12 });
    }
}

function initEnemies() {
    enemies = [];
    const cols = 5;
    const rows = 3;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            enemies.push({ x: c * 80 + 40, y: r * 60 + 20, w: 35, h: 30, alive: true });
        }
    }
}

function update() {
    if (!gameActive) return;

    // Player movement
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.w) player.x += player.speed;

    // Bullets movement
    bullets = bullets.filter(b => {
        b.y -= 8;
        return b.y > 0;
    });

    // Enemies movement
    let hitEdge = false;
    enemies.forEach(e => {
        if (!e.alive) return;
        e.x += e.direction;
        if (e.x <= 0 || e.x + e.w >= canvas.width) hitEdge = true;
        if (e.y + e.h >= canvas.height - 40) endGame("GAME OVER");
    });

    if (hitEdge) {
        enemies.forEach(e => {
            e.direction *= -1;
            e.y += 30;
        });
    }

    // Collision detection
    bullets.forEach((b, bIdx) => {
        enemies.forEach(e => {
            if (e.alive && 
                b.x < e.x + e.w && 
                b.x + b.w > e.x && 
                b.y < e.y + e.h && 
                b.y + b.h > e.y) {
                e.alive = false;
                bullets.splice(bIdx, 1);
                score += 10;
                scoreVal.innerText = score;
            }
        });
    });

    // Check if all enemies defeated
    if (enemies.length > 0 && enemies.every(e => !e.alive)) endGame("YOU WIN!");
}

function draw() {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw player (green rectangle)
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    
    // Draw bullets (white rectangles)
    ctx.fillStyle = '#ffffff';
    bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // Draw enemies (red rectangles)
    ctx.fillStyle = '#ff0000';
    enemies.forEach(e => {
        if (e.alive) {
            ctx.fillRect(e.x, e.y, e.w, e.h);
        }
    });

    if (gameActive) {
        update();
        gameLoopId = requestAnimationFrame(draw);
    }
}

function endGame(msg) {
    gameActive = false;
    gameMsg.innerText = msg;
    startBtn.disabled = false;
    startBtn.innerText = "Play Again";
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
}

startBtn.onclick = () => {
    score = 0;
    scoreVal.innerText = score;
    gameMsg.innerText = "";
    bullets = [];
    gameActive = true;
    startBtn.disabled = true;
    
    player.x = canvas.width / 2 - player.w / 2;
    player.y = canvas.height - 50;
    
    initEnemies();
    enemies.forEach(e => e.direction = 2);
    
    draw();
};

// --- BUBBLE TRAIL LOGIC ---
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.5) return;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 15 + 5 + "px";
    bubble.style.width = size;
    bubble.style.height = size;

    bubble.style.left = e.clientX + "px";
    bubble.style.top = e.clientY + "px";

    document.body.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, 2000);
});
