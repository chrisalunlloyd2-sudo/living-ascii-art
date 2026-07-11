const container = document.getElementById('ascii-container');

// Rainbow wave effect using pure CSS + JavaScript
let hue = 0;
const chars = '█▓▒░ .:-=+*#%@';

function generateWaveText(width, height, seed) {
  let result = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const wave = Math.sin((x * 0.05) + (y * 0.02) + (seed * 0.01));
      const charIdx = Math.floor((wave + 1) * chars.length / 2);
      result += chars[charIdx];
    }
    result += '\n';
  }
  return result;
}

function updateWave() {
  hue = (hue + 1) % 360;
  container.style.color = `hsl(${hue}, 100%, 50%)`;
  container.style.textShadow = `0 0 10px hsl(${hue}, 100%, 50%), 0 0 20px hsl(${(hue + 60) % 360}, 100%, 50%)`;
}

// Start rainbow animation
setInterval(updateWave, 50);

// Load data and display
async function loadContent() {
  try {
    // Wave background
    const waveText = generateWaveText(80, 25, Date.now());
    container.innerHTML = `<div style="color: #00ff00; text-shadow: 0 0 5px #00ff00;">${waveText}</div>`;
    
    // Try to load content
    const response = await fetch('data.json');
    if (response.ok) {
      const data = await response.json();
      displayContent(data);
    } else {
      displayDefault();
    }
  } catch (e) {
    displayDefault();
  }
}

function displayContent(data) {
  let html = '<div style="color: #00ff80; font-weight: bold;">🧠 TECH HEADLINES</div>';
  if (data.headlines && data.headlines.length) {
    data.headlines.forEach(h => {
      html += `<div>📰 ${h}</div>`;
    });
  }
  html += '<br><div style="color: #00ff80; font-weight: bold;">💻 GITHUB INSIGHTS</div>';
  if (data.repos && data.repos.length) {
    data.repos.forEach(r => {
      html += `<div>🚀 ${r.name}: ${r.next || 'Active'}</div>`;
    });
  }
  container.innerHTML += html;
}

function displayDefault() {
  container.innerHTML = `
    <div style="color: #00ff80; font-weight: bold;">🧠 TECH HEADLINES</div>
    <div>📰 Quantum AI Breakthrough: New Compiler Achieves 100x Speedup</div>
    <div>📰 Hardware Innovation: Open-Source RISC-V Chip Reaches 5GHz</div>
    <br>
    <div style="color: #00ff80; font-weight: bold;">💻 GITHUB INSIGHTS</div>
    <div>🚀 frontier-ai-dlc: Resolve AST tree fragmentation in src/reset</div>
    <div>🚀 moe-gui-architecture: GPU kernel integration pending</div>
  `;
}

loadContent();
setInterval(loadContent, 300000); // Refresh every 5 minutes
