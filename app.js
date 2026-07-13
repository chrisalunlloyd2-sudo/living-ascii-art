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

// Live Feed (updates every 5 min)
function createLiveFeed(data) {
    const techHeadline = data.headlines.length > 0 ? data.headlines[0].title : "Tech News Unavailable";
    const asciiHeadline = textToAscii(techHeadline);
    
    const asciiRepos = data.repos.map((repo, index) =>
        `${index + 1}. ${repo.name}: ${repo.next || 'No next issue'}`
    ).join('\n');
    
    const asciiSteps = data.next_steps?.map((step, index) =>
        `${index + 1}. ${step}`
    ).join('\n') || 'No next steps defined';

    return `
        <div class="tech-section">
            <h2>🔬 Tech Headline</h2>
            <pre class="ascii-art">${asciiHeadline}</pre>
            ${data.headlines.length > 0 && data.headlines[0].link ? `<p><a href="${data.headlines[0].link}" target="_blank">Read more</a></p>` : ''}
        </div>
        
        <div class="repos-section">
            <h2>💻 GitHub Projects</h2>
            <pre class="ascii-art">${asciiRepos}</pre>
        </div>
        
        <div class="steps-section">
            <h2>📋 Next Steps</h2>
            <pre class="ascii-art">${asciiSteps}</pre>
        </div>
        
        <div class="footer">
            <p>Updated: ${new Date(data.date || data.timestamp || Date.now()).toLocaleString()}</p>
        </div>
    `;
}

// Walkthroughs (static, renders once)
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
