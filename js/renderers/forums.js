function createForums(data) {
    const forums = data.forums || { categories: [] };
    if (!forums.categories || forums.categories.length === 0) {
        return '<p style="color:#888; text-align:center; padding:20px;">No forums configured.</p>';
    }

    return forums.categories.map(cat => {
        const storedPosts = JSON.parse(localStorage.getItem('ascii_forums_posts') || '{}');
        const allPosts = [...(cat.posts || []), ...(storedPosts[cat.id] || [])];

        const postsHtml = allPosts.length === 0
            ? '<p style="color:#666; font-style:italic; padding:10px 0;">No posts yet. Be the first.</p>'
            : allPosts.map(post => `
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

        return `
            <div class="forum-category" style="
                background: #0d0d0d;
                border: 1px solid #00ff00;
                border-radius: 6px;
                padding: 20px;
                margin-bottom: 20px;
            ">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap;">
                    <div>
                        <h3 style="color:#00ffcc; margin:0;">${escapeHtml(cat.title)}</h3>
                        <p style="color:#888; margin:5px 0 0; font-size:13px;">${escapeHtml(cat.description)}</p>
                    </div>
                    <button class="btn btn-primary new-post-btn" data-category="${cat.id}" style="margin-top:8px;">+ New Post</button>
                </div>
                <div class="forum-posts" id="posts-${cat.id}">${postsHtml}</div>
            </div>
        `;
    }).join('');
}
