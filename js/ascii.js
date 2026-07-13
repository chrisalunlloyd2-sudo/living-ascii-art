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
    return out.join('\\n');
}
