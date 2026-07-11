const container = document.getElementById('ascii-container');

// Rainbow wave effect - pure color animation (no text replacement)
let hue = 0;
const chars = '█▓▒░ .:-=+*#%@';

function updateRainbow() {
  hue = (hue + 2) % 360;
  container.style.color = `hsl(${hue}, 100%, 50%)`;
  container.style.textShadow = `0 0 8px hsl(${hue}, 100%, 70%), 0 0 16px hsl(${(hue + 60) % 360}, 100%, 70%)`;
}

// Start rainbow animation
setInterval(updateRainbow, 80);

// Load data and display
async function loadContent() {
  try {
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
  let html = '<div class="wave-effect">';
  html += '<div class="section"><div class="headline">🧠 TECH HEADLINES</div>';
  if (data.headlines && data.headlines.length) {
    data.headlines.forEach(h => {
      html += `<div class="item">📰 ${h}</div>`;
    });
  }
  html += '</div><br>';
  html += '<div class="section"><div class="headline">💻 GITHUB INSIGHTS</div>';
  if (data.repos && data.repos.length) {
    data.repos.forEach(r => {
      html += `<div class="item">🚀 <a href="${r.url}" target="_blank">${r.name}</a>: ${r.next_issue || 'Active'}</div>`;
    });
  }
  html += '</div></div>';
  
  // Add next steps from emails
  if (data.next_steps) {
    html += '<div class="section"><div class="headline">▶️ NEXT STEPS</div>';
    for (const [key, step] of Object.entries(data.next_steps)) {
      html += `<div class="item">• ${key}: ${step}</div>`;
    }
    html += '</div>';
  }
  
  container.innerHTML = html;
}

function displayDefault() {
  container.innerHTML = `
    <div class="wave-effect">
      <div class="section">
        <div class="headline">🧠 TECH HEADLINES</div>
        <div class="item">📰 Quantum AI Breakthrough: 100x Speedup in Neural Compilers</div>
      </div><br>
      <div class="section">
        <div class="headline">💻 GITHUB INSIGHTS</div>
        <div class="item">🚀 <a href="https://github.com/chrisalunlloyd2-sudo/frontier-ai-dlc" target="_blank">frontier-ai-dlc</a>: AST tree fragmentation fix</div>
        <div class="item">🚀 <a href="https://github.com/chrisalunlloyd2-sudo/moe-gui-architecture" target="_blank">moe-gui-architecture</a>: GPU kernel integration</div>
      </div>
      <div class="section">
        <div class="headline">▶️ NEXT STEPS</div>
        <div class="item">• frontier-ai-dlc: AST tree fragmentation fix</div>
        <div class="item">• moe-gui-architecture: GPU kernel integration</div>
      </div>
    </div>
  `;
}

loadContent();
setInterval(loadContent, 300000);
