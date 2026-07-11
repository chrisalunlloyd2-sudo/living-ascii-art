function asciiFromText(text) {
  const chars = '&@#%*+=-:.?|';
  let out = '';
  for (const ch of text.toUpperCase().replace(/[^A-Z0-9 ]/g,'').slice(0,40)) {
    if (ch === ' ') { out += '  '; continue; }
    out += chars[ch.charCodeAt(0) % chars.length] + ' ';
  }
  return out.trim();
}

async function loadData() {
  try {
    const [newsRes, repoRes] = await Promise.all([
      fetch('./news.json'), fetch('./repos.json')
    ]);
    const news = await newsRes.json();
    const repos = await repoRes.json();
    const head = (news[0] && news[0].title) || 'WORLD NEWS';
    const repo = (repos[0] && repos[0].name) || 'GITHUB';
    const html = `
      <div class="news-section">
        <h3>🌍 What's happening today</h3>
        <div class="ascii-art">${asciiFromText(head)}</div>
        <ul>${news.map(n=>`<li><a href="${n.link}" target="_blank">${n.title}</a></li>`).join('')}</ul>
      </div>
      <div class="github-section">
        <h3>💻 Random GitHub Projects</h3>
        <div class="ascii-art">${asciiFromText('GITHUB ' + repo)}</div>
        ${repos.map(r=>`
          <div class="repo-card">
            <a href="${r.url}" target="_blank"><strong>${r.name}</strong></a>
            <p>${r.description || 'No description'}</p>
            <small>⭐ ${r.stars} | Updated: ${new Date(r.updated).toLocaleDateString()}</small>
          </div>`).join('')}
      </div>`;
    const el = document.getElementById('ascii-container');
    el.innerHTML = html;
    setTimeout(()=>{ el.style.opacity='1'; setTimeout(()=>{ el.style.opacity='0'; },5000); },800);
  } catch(e) {
    document.getElementById('ascii-container').innerHTML = '<p>Error loading data.</p>';
  }
}
loadData();
setInterval(loadData, 300000);
