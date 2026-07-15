// ===== INTERACTIONS =====
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

// ===== FORUM AUTH =====
// Forum credentials moved to CONFIG.forumCredentials

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

    if (username === CONFIG.forumCredentials.username && password === CONFIG.forumCredentials.password) {
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

function initForumInteractions() {
    document.querySelectorAll('.new-post-btn').forEach(btn => {
        btn.addEventListener('click', () => openNewPostModal(btn.dataset.category));
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close') || e.target.id === 'post-modal') {
            closeModal();
        }
    });

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
        const form = document.getElementById('new-post-form');
        if (form) form.reset();
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

    const storedPosts = JSON.parse(localStorage.getItem('ascii_forums_posts') || '{}');
    if (!storedPosts[categoryId]) storedPosts[categoryId] = [];
    storedPosts[categoryId].unshift(newPost);
    localStorage.setItem('ascii_forums_posts', JSON.stringify(storedPosts));

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
                    <a href="#" style="color:#00ffcc; text-decoration:none;">${escapeHtml(post.title)}</a>
                </h4>
                <div style="color:#888; font-size:12px; margin-bottom:8px;">
                    by <span style="color:#00ffff;">${escapeHtml(post.author)}</span> •
                    ${new Date(post.timestamp).toLocaleString()} •
                    ${post.replies} replies
                </div>
                <p style="color:#ccc; font-size:13px;">${escapeHtml(post.excerpt)}</p>
            </article>
        `).join('');
    }

    closeModal();
}
