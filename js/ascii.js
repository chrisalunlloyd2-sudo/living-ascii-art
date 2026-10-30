// ===== ASCII GENERATION =====
const asciiFont = {
    'A': [" # ", "# #", "###", "# #", "# #"],
    'B': ["## ", "# #", "## ", "# #", "## "],
    'C': [" ##", "#  ", "#  ", "#  ", " ##"],
    'D': ["## ", "# #", "# #", "# #", "## "],
    'E': ["###", "#  ", "## ", "#  ", "###"],
    'F': ["###", "#  ", "## ", "#  ", "#  "],
    'G': [" ##", "#  ", "# ##", "#  #", " ###"],
    'H': ["# #", "# #", "###", "# #", "# #"],
    'I': ["###", " # ", " # ", " # ", "###"],
    'J': ["###", "  #", "  #", "# #", " ##"],
    'K': ["# #", "# #", "## ", "# #", "# #"],
    'L': ["#  ", "#  ", "#  ", "#  ", "###"],
    'M': ["# #", "###", "# #", "# #", "# #"],
    'N': ["# #", "## #", "# # #", "# ##", "# #"],
    'O': [" # ", "# #", "# #", "# #", " # "],
    'P': ["## ", "# #", "## ", "#  ", "#  "],
    'Q': [" # ", "# #", "# #", "# #", " # #"],
    'R': ["## ", "# #", "## ", "# #", "# #"],
    'S': [" ###", "#   ", " ###", "   #", "### "],
    'T': ["###", " # ", " # ", " # ", " # "],
    'U': ["# #", "# #", "# #", "# #", " # "],
    'V': ["# #", "# #", "# #", "# #", " # "],
    'W': ["# #", "# #", "# #", "###", "# #"],
    'X': ["# #", " # ", " # ", " # ", "# #"],
    'Y': ["# #", " # ", " # ", " # ", " # "],
    'Z': ["###", "  #", " # ", "#  ", "###"],
    '0': [" # ", "# #", "# #", "# #", " # "],
    '1': [" # ", "## ", " # ", " # ", "###"],
    '2': ["###", "  #", "###", "#  ", "###"],
    '3': ["###", "  #", "###", "  #", "###"],
    '4': ["# #", "# #", "###", "  #", "  #"],
    '5': ["###", "#  ", "###", "  #", "###"],
    '6': [" # ", "#  ", "###", "# #", " # "],
    '7': ["###", "  #", "  #", "  #", "  #"],
    '8': [" # ", "# #", " # ", "# #", " # "],
    '9': [" # ", "# #", "###", "  #", " # "],
    ' ': ["   ", "   ", "   ", "   ", "   "],
    ':': ["   ", " # ", "   ", " # ", "   "],
    '-': ["   ", "   ", "###", "   ", "   "],
    '.': ["   ", "   ", "   ", "   ", " # "],
    '!': [" # ", " # ", " # ", "   ", " # "],
    '?': ["###", "  #", " # ", "   ", " # "],
    '/': ["  #", " # ", "#  ", "   ", "   "],
    '(': [" # ", "#  ", "#  ", "#  ", " # "],
    ')': [" # ", "  #", "  #", "  #", " # "],
    '_': ["   ", "   ", "   ", "   ", "###"],
    '+': ["   ", " # ", "###", " # ", "   "],
    '=': ["   ", "###", "   ", "###", "   "],
    '@': [" # ", "# #", "###", "# #", "# #"],
    '#': [" # ", "###", " # ", "###", " # "],
    '$': [" # ", "###", " # ", "###", " # "],
    '%': ["# #", "# #", " # ", "#  ", "# #"],
    '^': [" # ", "# #", "   ", "   ", "   "],
    '&': [" # ", "# #", " # ", "# #", "# #"],
    '*': ["   ", " # ", "###", " # ", "   "],
    '|': [" # ", " # ", " # ", " # ", " # "],
    '\\': ["#  ", " # ", "  #", "   ", "   "],
    '~': ["   ", "~ ~", "   ", "   ", "   "],
    '`': [" # ", "   ", "   ", "   ", "   "],
    ';': ["   ", " # ", "   ", " # ", " # "],
    '"': ["# #", "# #", "   ", "   ", "   "],
    "'": [" # ", "   ", "   ", "   ", "   "],
    '<': ["  #", " # ", "#  ", " # ", "  #"],
    '>': ["#  ", " # ", "  #", " # ", "#  "],
    ',': ["   ", "   ", "   ", " # ", " # "],
};

function charToAscii(char) {
    const upper = char.toUpperCase();
    return asciiFont[upper] || asciiFont[' '];
}

function textToAscii(text, maxWidth = 80) {
    const lines = ['', '', '', '', ''];
    let currentWidth = 0;
    for (const char of text) {
        const charArt = charToAscii(char);
        const charWidth = 3;
        if (currentWidth + charWidth > maxWidth) break;
        for (let i = 0; i < 5; i++) lines[i] += charArt[i];
        currentWidth += charWidth;
    }
    return lines.join('\\n');
}

function mulberry32(a) {
    return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function generateDailyAsciiArt(type, seed, cols, rows) {
    const rng = mulberry32(Number(seed) || 1);
    const out = [];
    if (type === 'spiral_galaxy') {
        for (let y = 0; y < rows; y++) {
            let line = '';
            for (let x = 0; x < cols; x++) {
                const cx = x - cols / 2, cy = y - rows / 2;
                const r = Math.sqrt(cx * cx + cy * cy);
                const angle = Math.atan2(cy, cx);
                const density = Math.sin(r * 0.5 - angle * 3 + seed) * Math.exp(-r / 12);
                line += density > 0.3 ? '*' : density > -0.1 ? '.' : ' ';
            }
            out.push(line);
        }
    } else if (type === 'matrix_rain') {
        const chars = '01αβΓπΣΩ';
        for (let y = 0; y < rows; y++) {
            let line = '';
            for (let x = 0; x < cols; x++) line += rng() > 0.7 ? chars[Math.floor(rng() * chars.length)] : ' ';
            out.push(line);
        }
    } else if (type === 'fractal_tree') {
        const canvas = Array(rows).fill(null).map(() => Array(cols).fill(' '));
        function branch(x, y, len, angle) {
            if (len < 1 || x < 0 || x >= cols || y < 0 || y >= rows) return;
            const x2 = Math.round(x + len * Math.cos(angle));
            const y2 = Math.round(y - len * Math.sin(angle));
            const steps = Math.max(Math.abs(x2 - x), Math.abs(y2 - y));
            for (let i = 0; i <= steps; i++) {
                const px = Math.round(x + (x2 - x) * i / steps);
                const py = Math.round(y + (y2 - y) * i / steps);
                if (px >= 0 && px < cols && py >= 0 && py < rows) canvas[py][px] = '|';
            }
            branch(x2, y2, len * 0.7, angle - 0.3);
            branch(x2, y2, len * 0.7, angle + 0.3);
        }
        branch(cols / 2, rows - 1, 6, Math.PI / 2);
        out.push(...canvas.map(r => r.join('')));
    } else {
        for (let y = 0; y < rows; y++) {
            let line = '';
            for (let x = 0; x < cols; x++) {
                const wave = Math.sin((x + Number(seed)) * 0.2) * (rows / 3) + (rows / 2);
                const dist = Math.abs(wave - y);
                line += dist < 0.8 ? '#' : dist < 1.8 ? '+' : ' ';
            }
            out.push(line);
        }
    }
    return out.join('\n');
}

function _hexSwirlBoard(cols, rows, seed) {
    const rng = mulberry32(Number(seed) || 1);
    const cx = cols / 2, cy = rows / 2;
    const arms = 2 + Math.floor(rng() * 4);
    const twist = 1.5 + rng() * 2.5;
    const jitter = rng() * 0.5;
    const chars = [' ', '.', ':', '·', '*', 'o', '@'];
    const out = [];
    for (let y = 0; y < rows; y++) {
        let line = '';
        for (let x = 0; x < cols; x++) {
            const dx = (x - cx) / (cols / 2), dy = ((y - cy) * 2.1) / rows;
            const r = Math.sqrt(dx * dx + dy * dy);
            let a = Math.atan2(dy, dx);
            if (a < 0) a += 2 * Math.PI;
            const spiral = a + twist * r + jitter * (rng() - 0.5);
            const band = Math.sin(arms * spiral) * Math.exp(-r * 0.8);
            let v = Math.abs(band) * 6;
            line += chars[Math.min(6, Math.floor(v))];
        }
        out.push(line);
    }
    return out.join('\n');
}

function _gridPulseBoard(cols, rows, seed) {
    const rng = mulberry32(Number(seed) || 1);
    const pulses = [];
    const n = 2 + Math.floor(rng() * 2);
    for (let i = 0; i < n; i++) {
        pulses.push({ x: cols * rng(), y: rows * rng(), w: 0.8 + rng() * 0.7, a: (rng() * 2 * Math.PI) });
    }
    const shades = ' .x#';
    const out = [];
    for (let y = 0; y < rows; y++) {
        let line = '';
        for (let x = 0; x < cols; x++) {
            let amp = 0;
            for (const p of pulses) {
                const dx = (x - p.x) * (1 + 0.3 * Math.cos(p.a)), dy = (y - p.y) * (1 + 0.3 * Math.sin(p.a));
                const d = Math.sqrt(dx * dx + dy * dy);
                const ring = Math.sin(d * 1.7 - (seed % 100) * 0.1) / Math.max(1, d * 0.55);
                if (ring > 0) amp += ring * p.w;
            }
            line += shades[Math.min(3, Math.floor(amp * 2))];
        }
        out.push(line);
    }
    return out.join('\n');
}

function _flockBoard(cols, rows, seed) {
    const rng = mulberry32(Number(seed) || 1);
    const N = 8 + Math.floor(rng() * 9);
    const birds = Array.from({ length: N }, () => ({
        x: rng() * cols, y: rng() * rows,
        vx: (rng() - 0.5) * 1.6, vy: (rng() - 0.5) * 0.8
    }));
    const target = { x: cols * 0.7, y: rows * 0.4 };
    const out = [];
    for (let s = 0; s < 24; s++) {
        for (const b of birds) {
            let ax = 0, ay = 0;
            for (const o of birds) {
                if (o === b) continue;
                const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
                if (d2 < 9) { ax -= dx * 0.7; ay -= dy * 0.7; }          // separation
                else if (d2 < 120) { ax += dx * 0.04; ay += dy * 0.04; } // cohesion
                ax += o.vx * 0.09; ay += o.vy * 0.09;                    // alignment
            }
            ax += (target.x - b.x) * 0.012 + (rng() - 0.5) * 0.4;        // gentle waypoint pull
            ay += (target.y - b.y) * 0.012;
            b.vx = Math.max(-1.6, Math.min(1.6, b.vx + ax * 0.16));
            b.vy = Math.max(-0.9, Math.min(0.9, b.vy + ay * 0.16));
            b.x = (b.x + b.vx + cols) % cols;
            b.y = (b.y + b.vy + rows) % rows;
        }
    }
    const grid = Array.from({ length: rows }, () => Array(cols).fill(' '));
    const trails = '.·*';
    for (const b of birds) {
        const px = Math.floor(b.x) % cols, py = Math.floor(b.y) % rows;
        const speed = Math.hypot(b.vx, b.vy);
        const ch = speed > 1.0 ? '▲' : speed > 0.55 ? '▼' : '·';
        grid[py][px] = ch;
        const tx = Math.round(px - b.vx), ty = Math.round(py - b.vy);
        if (tx >= 0 && tx < cols && ty >= 0 && ty < rows) grid[ty][tx] = trails[Math.min(2, Math.floor(speed * 3))];
    }
    out.push(...grid.map(r => r.join('')));
    return out.join('\n');
}

const EXTRA_GENERATORS = {
    hex_swirl: _hexSwirlBoard,
    grid_pulse: _gridPulseBoard,
    boids: _flockBoard
};
