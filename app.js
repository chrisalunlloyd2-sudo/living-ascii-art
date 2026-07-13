// Living ASCII Art - Main JavaScript
// Fetches data.json, renders live feed + walkthroughs + forums

// ===== UTILITIES =====
async function loadContent() {
    try {
        const response = await fetch('data.json?v=' + Date.now());
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const raw = await response.json();
        return normalizeData(raw);
    } catch (err) {
        console.error('Failed to load data.json:', err);
        return normalizeData(getFallbackData());
    }
}

function getFallbackData() {
    return {
        headlines: [{ title: "Tech News Unavailable", link: "#" }],
        repos: [],
        next_steps: [],
        walkthroughs: [],
        forums: { categories: [] },
        about: { title: "About", description: "", features: [], tech_stack: [], links: {} },
        contact: { email: "", github: "", note: "" }
    };
}


function normalizeData(data) {
    if (!data || typeof data !== 'object') return getFallbackData();

    // Normalize headlines: support both strings and objects
    if (!Array.isArray(data.headlines)) data.headlines = [];
    data.headlines = data.headlines.map(h => {
        if (typeof h === 'string') return { title: h, link: '#', source: 'legacy' };
        return h;
    });

    // Normalize repos: support next_issue or next
    if (!Array.isArray(data.repos)) data.repos = [];
    data.repos = data.repos.map(r => ({
        name: r.name || 'unknown',
        url: r.url || '#',
        next: r.next || r.next_issue || 'No next issue'
    }));

    // Ensure arrays exist
    if (!Array.isArray(data.next_steps)) data.next_steps = [];
    if (!Array.isArray(data.walkthroughs)) data.walkthroughs = [];
    if (!Array.isArray(data.incomplete_tasks)) data.incomplete_tasks = [];
    if (!Array.isArray(data.email_updates)) data.email_updates = [];

    return data;
}

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
        
        for (let i = 0; i < 5; i++) {
            lines[i] += charArt[i];
        }
        currentWidth += charWidth;
    }
    
    return lines.join('\n');
}

// ===== RENDER FUNCTIONS =====

// ===== WORKFLOW CARDS =====
function createWorkflowCards(data) {
    const cards = data.workflow_cards || [];
    if (!cards.length) return '<p class="note">No workflow cards yet.</p>';

    return '<div class="workflow-grid">' + cards.map(card => {
        const tabs = card.install_methods.map((m, i) => {
            const allLines = [...(m.pre_steps || []), ...m.steps, m.verify_command ? '# Verify\n' + m.verify_command : ''];
            return `
            <div class="tab-panel ${i === 0 ? 'active' : ''}" data-tab="${card.id}-m-${i}">
                <div class="method-header">
                    <span class="method-name">${escapeHtml(m.name)}</span>
                    <span class="method-meta">${escapeHtml(m.shell)} · ${escapeHtml(m.os)}</span>
                </div>
                <div class="dep-box">
                    <strong>Dependencies needed first:</strong>
                    <ul>${(card.dependencies || []).map(d => `<li><code>${escapeHtml(d.check_command)}</code> — ${escapeHtml(d.name)} <span class="dep-why">(${escapeHtml(d.why)})</span></li>`).join('')}</ul>
                </div>
                <div class="terminal-block">
                    <div class="terminal-header"><span>$</span><span>terminal</span></div>
                    <pre class="terminal-body"><code>${escapeHtml(allLines.join('\n'))}</code></pre>
                    <button class="copy-btn" data-copy="${escapeHtml(allLines.join('\n'))}">Copy all</button>
                </div>
                ${m.pitfalls ? `<p class="method-pitfall"><strong>Pitfall:</strong> ${escapeHtml(m.pitfalls)}</p>` : ''}
                ${m.fallback ? `<p class="method-fallback"><strong>Fallback:</strong> <code>${escapeHtml(m.fallback)}</code></p>` : ''}
            </div>`;
        }).join('');

        const depInstall = (card.dependency_install || []).map(d => `
            <div class="dep-install-block">
                <h5>${escapeHtml(d.name)}</h5>
                <div class="terminal-block">
                    <div class="terminal-header"><span>$</span><span>${escapeHtml(d.shell)}</span></div>
                    <pre class="terminal-body"><code>${escapeHtml((d.steps || []).join('\n'))}</code></pre>
                    <button class="copy-btn" data-copy="${escapeHtml((d.steps || []).join('\n'))}">Copy steps</button>
                </div>
            </div>
        `).join('');

        const useCases = (card.use_cases || []).map((u, i) => `
            <div class="use-case">
                <h5>${i + 1}. ${escapeHtml(u.title)}</h5>
                <p class="use-context">${escapeHtml(u.context)}</p>
                <div class="terminal-block">
                    <div class="terminal-header"><span>$</span><span>demo</span></div>
                    <pre class="terminal-body"><code>${escapeHtml((u.demo_commands || []).join('\n'))}</code></pre>
                    <button class="copy-btn" data-copy="${escapeHtml((u.demo_commands || []).join('\n'))}">Copy demo</button>
                </div>
                <p class="expected-output"><strong>Expected:</strong> ${escapeHtml(u.expected_output)}</p>
            </div>
        `).join('');

        const quickCopies = (card.copy_sections || []).map(c => `
            <button class="copy-section-btn" data-copy="${escapeHtml(c.text)}">${escapeHtml(c.label)}</button>
        `).join('');

        const tips = (card.pro_tips || []).map(t => `<li>${escapeHtml(t)}</li>`).join('');
        const links = (card.related_links || []).map(l => `
            <a href="${escapeHtml(l.url)}" target="_blank">${escapeHtml(l.label)}</a>
        `).join(' · ');

        return `
        <article class="workflow-card" id="card-${card.id}">
            <header class="card-header">
                <div class="card-title-row">
                    <h3>${escapeHtml(card.name)}</h3>
                    <span class="card-tag">${escapeHtml(card.category)}</span>
                    <span class="card-difficulty">${escapeHtml(card.difficulty)}</span>
                    ${card.metrics ? '<span class="card-metric">★ ' + escapeHtml(card.metrics.claim) + '</span>' : ''}
                </div>
                <p class="card-tagline">${escapeHtml(card.tagline)}</p>
            </header>
            <div class="card-body">
                <p class="card-why">${escapeHtml(card.why_use)}</p>
                ${card.deprecated ? `<div class="deprecation-banner">⚠️ Deprecated: ${escapeHtml(card.deprecated)}</div>` : ''}
                ${card.metrics ? `<div class="metric-callout"><strong>${escapeHtml(card.metrics.claim)}</strong> · ${escapeHtml(card.metrics.evidence)}</div>` : ''}

                <div class="quick-copy-row">${quickCopies}</div>

                <div class="method-tabs">
                    <div class="tab-buttons">${card.install_methods.map((m, i) => `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-target="${card.id}-m-${i}">${escapeHtml(m.name.split('—')[0].trim())}</button>`).join('')}</div>
                    ${tabs}
                </div>

                ${card.dependency_install ? `
                <div class="dependency-install-section">
                    <h4>🔧 Bare-terminal dependency install</h4>
                    ${depInstall}
                </div>` : ''}

                <div class="use-cases-section">
                    <h4>Use cases — you are the terminal</h4>
                    ${useCases}
                </div>

                ${tips ? `<div class="pro-tips"><h4>Pro tips</h4><ul>${tips}</ul></div>` : ''}
                ${links ? `<div class="related-links"><strong>Links:</strong> ${links}</div>` : ''}
            </div>
        </article>`;
    }).join('') + '</div>';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function bindWorkflowTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            const card = btn.closest('.workflow-card');
            if (!card) return;
            card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            card.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = card.querySelector('[data-tab="' + target + '"]');
            if (panel) panel.classList.add('active');
        });
    });
    document.querySelectorAll('.copy-btn, .copy-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(btn.dataset.copy).then(() => {
                const old = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = old, 1200);
            });
        });
    });
}

// ===== DAILY FLEX =====
function renderDailyFlex(data) {
    const flex = data.daily_flex || {};
    if (!flex.type) return '';
    const today = new Date().toISOString().slice(0, 10);
    const seed = flex.seed || todayToSeed(today);
    const art = generateDailyAsciiArt(flex.type, seed, 60, 16);
    const options = (flex.vote_options || []).map(opt => `
        <button class="vote-btn ${flex.current_vote === opt ? 'voted' : ''}" data-vote="${escapeHtml(opt)}">${escapeHtml(opt.replace(/_/g, ' '))}</button>
    `).join('');

    return `
        <div class="daily-flex" id="daily-flex">
            <div class="flex-header">
                <h3>Daily Programmatic Flex · ${escapeHtml(flex.date)}</h3>
                <span class="flex-type">${escapeHtml(flex.title)}</span>
            </div>
            <p class="flex-desc">${escapeHtml(flex.description)}</p>
            <pre class="ascii-art daily-ascii">${escapeHtml(art)}</pre>
            <div class="flex-vote">
                <strong>Vote on tomorrow's flex:</strong>
                <div class="vote-options">${options}</div>
                <p class="vote-note">Votes are saved locally and tallied at 00:00 UTC.</p>
            </div>
        </div>`;
}

function todayToSeed(today) {
    const [y, m, d] = today.split('-').map(Number);
    return y * 10000 + m * 100 + d;
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

function bindDailyFlexVote() {
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const vote = btn.dataset.vote;
            localStorage.setItem('daily_flex_vote', vote);
            document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('voted'));
            btn.classList.add('voted');
        });
    });
    const saved = localStorage.getItem('daily_flex_vote');
    if (saved) {
        document.querySelectorAll('.vote-btn').forEach(b => b.classList.toggle('voted', b.dataset.vote === saved));
    }
}

// ===== PAGE COUNTER =====
function createPageCounter(data) {
    const views = data.metrics && data.metrics.page_views != null ? data.metrics.page_views : '—';
    return `<div class="page-counter">🧿 Foundry visitors: <strong>${views}</strong> · ${data.metrics.cards_count || 0} workflow cards · last updated ${data.updated_at || '—'}</div>`;
}


function createWalkthroughs(data) {
    if (!data.walkthroughs || data.walkthroughs.length === 0) {
        return '<p style="color:#888; text-align:center; padding:20px;">No walkthroughs yet.</p>';
    }
    
    return data.walkthroughs.map(wt => `
        <article class="walkthrough-card" style="
            background: #0d0d0d;
            border: 1px solid #00ff00;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.1);
        ">
            <div style="display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap;">
                <span style="background:#00ff00; color:#000; padding:2px 8px; border-radius:4px; font-size:11px;">${wt.category}</span>
                <span style="background:#ffaa00; color:#000; padding:2px 8px; border-radius:4px; font-size:11px;">${wt.difficulty}</span>
            </div>
            <h3 style="color:#00ff80; margin-bottom:10px; text-shadow:0 0 10px #00ff80;">${wt.title}</h3>
            <p style="color:#ccc; margin-bottom:15px; line-height:1.6;">${wt.description}</p>
            <ol class="menu-content" style="color:#00ffcc; line-height:1.8;">
                ${wt.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            ${wt.related_links && wt.related_links.length > 0 ? `
                <div style="margin-top:15px; padding-top:10px; border-top:1px solid #333;">
                    <strong style="color:#00ffff;">Related:</strong>
                    <ul class="menu-content" style="margin-top:5px;">
                        ${wt.related_links.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </article>
    `).join('');
}

// Forums (static, renders once with localStorage persistence)
function createForums(data) {
    if (!data.forums || !data.forums.categories || data.forums.categories.length === 0) {
        return '<p style="color:#888; text-align:center; padding:20px;">No forum categories yet.</p>';
    }
    
    // Load persisted posts from localStorage
    const storedPosts = JSON.parse(localStorage.getItem('ascii_forums_posts') || '{}');
    
    return data.forums.categories.map(cat => {
        // Merge stored posts with default posts
        const defaultPosts = cat.posts || [];
        const stored = storedPosts[cat.id] || [];
        const allPosts = [...defaultPosts, ...stored];
        
        return `
            <section class="forum-category" style="
                background: #0d0d0d;
                border: 1px solid #00ff00;
                border-radius: 6px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.1);
            ">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
                    <h3 style="color:#00ff80; text-shadow:0 0 10px #00ff80;">${cat.name}</h3>
                    <button class="new-post-btn" data-category="${cat.id}" style="
                        background: #00ff00;
                        color: #000;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        font-family: 'Courier New', monospace;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s;
                    ">+ New Post</button>
                </div>
                <p style="color:#888; margin-bottom:15px; font-size:13px;">${cat.description}</p>
                
                <div class="posts-list" id="posts-${cat.id}">
                    ${allPosts.length === 0 ? 
                        '<p style="color:#666; font-style:italic; text-align:center; padding:20px;">No posts yet. Be the first!</p>' :
                        allPosts.map(post => `
                            <article class="forum-post" style="
                                border-left: 3px solid #00ff00;
                                padding: 12px 15px;
                                margin-bottom: 10px;
                                background: rgba(0, 255, 0, 0.03);
                            ">
                                <h4 style="color:#00ffcc; margin-bottom:5px;">
                                    <a href="#" style="color:#00ffcc; text-decoration:none;">${post.title}</a>
                                </h4>
                                <div style="color:#888; font-size:12px; margin-bottom:8px;">
                                    by <span style="color:#00ffff;">${post.author}</span> • 
                                    ${new Date(post.timestamp).toLocaleString()} • 
                                    ${post.replies} replies
                                </div>
                                <p style="color:#ccc; font-size:13px;">${post.excerpt}</p>
                            </article>
                        `).join('')
                    }
                </div>
            </section>
        `;
    }).join('');
}

// About section
function createAbout(data) {
    const a = data.about || {};
    return `
        <div class="section">
            <h2>ℹ️ ${a.title || 'About'}</h2>
            <p class="menu-content" style="color:#ccc; line-height:1.8;">${a.description || ''}</p>
            
            ${a.features && a.features.length > 0 ? `
                <h3 style="color:#00ff80; margin:20px 0 10px;">Features</h3>
                <ul class="menu-content">
                    ${a.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${a.tech_stack && a.tech_stack.length > 0 ? `
                <h3 style="color:#00ff80; margin:20px 0 10px;">Tech Stack</h3>
                <ul class="menu-content">
                    ${a.tech_stack.map(t => `<li>${t}</li>`).join('')}
                </ul>
            ` : ''}
            
            ${a.links ? `
                <h3 style="color:#00ff80; margin:20px 0 10px;">Links</h3>
                <ul class="menu-content">
                    ${Object.entries(a.links).map(([k,v]) => `<li><a href="${v}" target="_blank">${k}: ${v}</a></li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `;
}

// Contact section
function createContact(data) {
    const c = data.contact || {};
    return `
        <div class="section">
            <h2>📧 ${c.title || 'Contact'}</h2>
            <p class="menu-content" style="color:#ccc; line-height:1.8;">${c.note || ''}</p>
            <ul class="menu-content">
                ${c.email ? `<li>Email: <a href="mailto:${c.email}">${c.email}</a></li>` : ''}
                ${c.github ? `<li>GitHub: <a href="${c.github}" target="_blank">${c.github}</a></li>` : ''}
            </ul>
        </div>
    `;
}

// ===== MAIN UPDATE =====
async function updatePage() {
    console.log('[ASCII] updatePage starting...');
    try {
        const data = await loadContent();
        console.log('[ASCII] data loaded:', {headlines: data.headlines.length, repos: data.repos.length, walkthroughs: data.walkthroughs.length});

        const workflowContainer = document.getElementById('workflow-cards-content');
        if (workflowContainer) {
            workflowContainer.innerHTML = createWorkflowCards(data);
            bindWorkflowTabs();
        }

        const flexContainer = document.getElementById('daily-flex-content');
        if (flexContainer) {
            flexContainer.innerHTML = renderDailyFlex(data);
            bindDailyFlexVote();
        }

        const counterContainer = document.getElementById('page-counter-content');
        if (counterContainer) {
            counterContainer.innerHTML = createPageCounter(data);
        }

        // Live feed (updates every 5 min)
        const feedContainer = document.getElementById('live-feed');
        if (feedContainer) {
            feedContainer.innerHTML = createLiveFeed(data);
        }

        // Static sections (render once on load)
        if (!window.sectionsRendered) {
            const walkthroughsContainer = document.getElementById('walkthroughs-content');
            if (walkthroughsContainer) {
                walkthroughsContainer.innerHTML = createWalkthroughs(data);
            }

            const forumsContainer = document.getElementById('forums-content');
            if (forumsContainer) {
                forumsContainer.innerHTML = createForums(data);
                initForumInteractions();
            }

            const aboutContainer = document.getElementById('about-content');
            if (aboutContainer) {
                aboutContainer.innerHTML = createAbout(data);
            }

            const contactContainer = document.getElementById('contact-content');
            if (contactContainer) {
                contactContainer.innerHTML = createContact(data);
            }

            window.sectionsRendered = true;
        }

        console.log('[ASCII] updatePage complete');
    } catch (err) {
        console.error('[ASCII] updatePage error:', err);
        const feed = document.getElementById('live-feed');
        if (feed) feed.innerHTML += '<pre style="color:#ff4444;">[ERROR] ' + err.message + '</pre>';
    }
}


// ===== FORUM AUTH =====
const FORUM_CREDENTIALS = { username: 'Viper', password: 'clamchowder' };

function isForumAuthenticated() {
    return sessionStorage.getItem('forum_auth') === 'true';
}

function showForumLoginModal(categoryId) {
    const modal = document.getElementById('post-modal');
    const form = document.getElementById('new-post-form');
    if (form) {
        form.innerHTML = `
            <input type="hidden" id="post-category" name="category" value="${categoryId || ''}">
            <div class="form-group">
                <label for="forum-username">Username</label>
                <input type="text" id="forum-username" name="username" required placeholder="Enter forum username...">
            </div>
            <div class="form-group">
                <label for="forum-password">Password</label>
                <input type="password" id="forum-password" name="password" required placeholder="Enter forum password...">
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary modal-close">Cancel</button>
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
        `;
        form.onsubmit = handleForumLogin;
    }
    if (modal) modal.style.display = 'flex';
}

function handleForumLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const categoryId = formData.get('category');
    
    if (username === FORUM_CREDENTIALS.username && password === FORUM_CREDENTIALS.password) {
        sessionStorage.setItem('forum_auth', 'true');
        closeModal();
        restorePostForm();
        if (categoryId) openNewPostModal(categoryId);
    } else {
        alert('Invalid forum credentials. Try again.');
    }
}

function restorePostForm() {
    const form = document.getElementById('new-post-form');
    if (!form) return;
    form.innerHTML = `
        <input type="hidden" id="post-category" name="category">
        <div class="form-group">
            <label for="post-title">Title</label>
            <input type="text" id="post-title" name="title" required maxlength="100" placeholder="Enter post title...">
        </div>
        <div class="form-group">
            <label for="post-author">Author (optional)</label>
            <input type="text" id="post-author" name="author" maxlength="30" placeholder="Your name or handle">
        </div>
        <div class="form-group">
            <label for="post-content">Content</label>
            <textarea id="post-content" name="content" required maxlength="5000" placeholder="Write your post..."></textarea>
        </div>
        <div class="modal-actions">
            <button type="button" class="btn btn-secondary modal-close">Cancel</button>
            <button type="submit" class="btn btn-primary">Post</button>
        </div>
    `;
    form.onsubmit = handleNewPost;
}

// ===== FORUM INTERACTIONS =====
function initForumInteractions() {
    // New post buttons
    document.querySelectorAll('.new-post-btn').forEach(btn => {
        btn.addEventListener('click', () => openNewPostModal(btn.dataset.category));
    });
    
    // Modal close
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close') || e.target.id === 'post-modal') {
            closeModal();
        }
    });
    
    // Form submit
    const form = document.getElementById('new-post-form');
    if (form) {
        form.addEventListener('submit', handleNewPost);
    }
}

function openNewPostModal(categoryId) {
    if (!isForumAuthenticated()) {
        showForumLoginModal(categoryId);
        return;
    }
    restorePostForm();
    const modal = document.getElementById('post-modal');
    const categoryInput = document.getElementById('post-category');
    if (modal && categoryInput) {
        categoryInput.value = categoryId;
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('post-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('new-post-form').reset();
    }
}

function handleNewPost(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const categoryId = formData.get('category');
    const title = formData.get('title').trim();
    const author = formData.get('author').trim() || 'Anonymous';
    const content = formData.get('content').trim();
    
    if (!title || !content) return;
    
    const newPost = {
        id: Date.now(),
        title,
        author,
        timestamp: new Date().toISOString(),
        replies: 0,
        excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : '')
    };
    
    // Save to localStorage
    const storedPosts = JSON.parse(localStorage.getItem('ascii_forums_posts') || '{}');
    if (!storedPosts[categoryId]) storedPosts[categoryId] = [];
    storedPosts[categoryId].unshift(newPost); // newest first
    localStorage.setItem('ascii_forums_posts', JSON.stringify(storedPosts));
    
    // Re-render this category
    const postsContainer = document.getElementById(`posts-${categoryId}`);
    if (postsContainer) {
        const allPosts = [...(storedPosts[categoryId] || [])];
        postsContainer.innerHTML = allPosts.map(post => `
            <article class="forum-post" style="
                border-left: 3px solid #00ff00;
                padding: 12px 15px;
                margin-bottom: 10px;
                background: rgba(0, 255, 0, 0.03);
            ">
                <h4 style="color:#00ffcc; margin-bottom:5px;">
                    <a href="#" style="color:#00ffcc; text-decoration:none;">${post.title}</a>
                </h4>
                <div style="color:#888; font-size:12px; margin-bottom:8px;">
                    by <span style="color:#00ffff;">${post.author}</span> • 
                    ${new Date(post.timestamp).toLocaleString()} • 
                    ${post.replies} replies
                </div>
                <p style="color:#ccc; font-size:13px;">${post.excerpt}</p>
            </article>
        `).join('');
    }
    
    closeModal();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updatePage();
    setInterval(updatePage, 5 * 60 * 1000); // 5 min
});
