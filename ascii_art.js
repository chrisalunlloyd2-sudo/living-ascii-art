const container = document.getElementById('ascii-container');

// 3D Wave Rainbow Effect
let t = 0;
const waveLayers = 3;

function update3DWave() {
  t += 0.02;
  const hue = (t * 5) % 360;
  const transform = `
    perspective(500px) 
    rotateX(${Math.sin(t) * 5}deg) 
    rotateY(${Math.cos(t) * 3}deg) 
    scale(${0.95 + Math.sin(t * 0.5) * 0.05})
  `;
  container.style.transform = transform;
  container.style.filter = `hue-rotate(${hue}deg) brightness(1.2)`;
  container.style.textShadow = `0 0 10px hsl(${hue}, 100%, 70%), 0 0 20px hsl(${(hue + 60) % 360}, 100%, 70%)`;
}

setInterval(update3DWave, 50);

// Load data and display
async function loadContent() {
  try {
    const response = await fetch('data.json?t=' + Date.now()); // Cache bust
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
  html += '</div>';
  if (data.next_steps) {
    html += '<div class="section"><div class="headline">▶️ NEXT STEPS</div>';
    for (const [key, step] of Object.entries(data.next_steps)) {
      html += `<div class="item">• ${key}: ${step}</div>`;
    }
    html += '</div>';
  }
  if (data.github_suggestion) {
    html += `<div class="section"><div class="headline">🔧 GITHUB SUGGESTION</div><div class="item">${data.github_suggestion}</div></div>`;
  }
  html += '</div>';
  
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
      <div class="section">
        <div class="headline">🔧 GITHUB SUGGESTION</div>
        <div class="item">Add CI workflow to frontier-ai-dlc that validates AST completeness on every PR</div>
      </div>
    </div>
  `;
}

loadContent();
setInterval(loadContent, 300000);
