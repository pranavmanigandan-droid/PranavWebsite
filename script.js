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

// === GAME CODE ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreVal = document.getElementById('score-val');
const gameMsg = document.getElementById('game-msg');
const startBtn = document.getElementById('start-btn');
const diffSlider = document.getElementById('diff-slider');
const diffLabel = document.getElementById('diff-label');

// Set canvas dimensions responsively
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(600, container.clientWidth - 40);
    const aspectRatio = 3 / 5;
    canvas.width = maxWidth;
    canvas.height = maxWidth * aspectRatio;
    // Recalculate submarine position
    submarine.y = canvas.height - 40;
    submarine.x = canvas.width / 2 - submarine.w / 2;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let score = 0;
let gameActive = false;
let bubbles = []; // Formerly bullets
let jellyfish = []; // Formerly invaders
let moveDirection = 1;
let swimSpeed = 1;
const keys = {};

const submarine = { x: 135, y: 460, w: 30, h: 18, speed: 5 };
const levels = ["Reef", "Shallows", "Abyss", "Trench", "Midnight"];

diffSlider.oninput = () => { diffLabel.innerText = levels[diffSlider.value - 1]; };

window.addEventListener('keydown', e => {
    if (["Space", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
    if (e.code === 'Space' && gameActive) releaseBubble();
});
window.addEventListener('keyup', e => keys[e.code] = false);

function releaseBubble() {
    if (bubbles.length < 5) {
        bubbles.push({ x: submarine.x + 13, y: submarine.y, r: 4 }); // Bubbles are round
    }
}

function initJellyfish() {
    jellyfish = [];
    const level = parseInt(diffSlider.value);
    const rows = 2 + level; 
    const cols = 3;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            jellyfish.push({ x: c * 35 + 40, y: r * 30 + 50, w: 20, h: 20, alive: true });
        }
    }
}

function update() {
    if (!gameActive) return;

    // Movement: Submarine
    if (keys['ArrowLeft'] && submarine.x > 0) submarine.x -= submarine.speed;
    if (keys['ArrowRight'] && submarine.x < canvas.width - submarine.w) submarine.x += submarine.speed;

    // Movement: Bubbles (Float up)
    bubbles.forEach((b, i) => { 
        b.y -= 6; 
        if (b.y < 0) bubbles.splice(i, 1); 
    });

    // Movement: Jellyfish
    let hitEdge = false;
    jellyfish.forEach(j => {
        if (!j.alive) return;
        j.x += moveDirection * swimSpeed;
        if (j.x + j.w > canvas.width - 5 || j.x < 5) hitEdge = true;
        if (j.y + j.h >= submarine.y) endGame("HULL BREACHED");
    });

    if (hitEdge) {
        moveDirection *= -1;
        jellyfish.forEach(j => j.y += 12);
    }

    // Collision Logic
    bubbles.forEach((b, bIdx) => {
        jellyfish.forEach(j => {
            if (j.alive && b.x > j.x && b.x < j.x + j.w && b.y > j.y && b.y < j.y + j.h) {
                j.alive = false;
                bubbles.splice(bIdx, 1);
                score += 15;
                scoreVal.innerText = score;
            }
        });
    });

    if (jellyfish.length > 0 && jellyfish.every(j => !j.alive)) endGame("REEF SAVED!");
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Submarine (Yellow)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.roundRect(submarine.x, submarine.y, submarine.w, submarine.h, 5);
    ctx.fill();
    // Submarine periscope
    ctx.fillRect(submarine.x + 20, submarine.y - 5, 4, 5);

    // Draw Bubbles (White Circles)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    bubbles.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Jellyfish (Pink/Coral with glow)
    jellyfish.forEach(j => {
        if (j.alive) {
            ctx.fillStyle = '#ff80ab';
            ctx.beginPath();
            ctx.arc(j.x + 10, j.y + 10, 10, Math.PI, 0); // Domed head
            ctx.fill();
            ctx.fillRect(j.x + 5, j.y + 10, 2, 18); // Tentacles
            ctx.fillRect(j.x + 10, j.y + 10, 2, 20);
            ctx.fillRect(j.x + 15, j.y + 10, 2, 18);
        }
    });

    if (gameActive) {
        update();
        requestAnimationFrame(draw);
    }
}

function endGame(msg) {
    gameActive = false;
    gameMsg.innerText = msg;
    startBtn.disabled = false;
    startBtn.innerText = "Surface & Retry";
}

startBtn.onclick = () => {
    score = 0; scoreVal.innerText = score; gameMsg.innerText = "";
    bubbles = []; gameActive = true; startBtn.disabled = true;
    initJellyfish(); draw();
};

// --- BUBBLE TRAIL LOGIC ---
document.addEventListener('mousemove', (e) => {
    // Only create a bubble occasionally to save performance
    if (Math.random() > 0.5) return; 

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random size for variety
    const size = Math.random() * 15 + 5 + "px";
    bubble.style.width = size;
    bubble.style.height = size;

    // Position at cursor
    bubble.style.left = e.clientX + "px";
    bubble.style.top = e.clientY + "px";

    document.body.appendChild(bubble);

    // Clean up the element after animation ends
    setTimeout(() => {
        bubble.remove();
    }, 2000);
});
