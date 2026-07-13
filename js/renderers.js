// ===== RENDERERS =====

function createLiveFeed(data) {
    const techHeadline = data.headlines.length > 0 ? data.headlines[0].title : "Tech News Unavailable";
    const asciiHeadline = textToAscii(techHeadline);

    const asciiRepos = data.repos.map((repo, index) =>
        `${index + 1}. ${repo.name}: ${repo.next || 'No next issue'}`
    ).join('\\n');

    const asciiSteps = data.next_steps?.map((step, index) =>
        `${index + 1}. ${step}`
    ).join('\\n') || 'No next steps defined';

    // Read more always points to the user's GitHub (never Wired)
    const moreLink = CONFIG?.github?.profile || 'https://github.com/chrisalunlloyd2-sudo';

    return `
        <div class="tech-section">
            <h2>🔬 Tech Headline</h2>
            <pre class="ascii-art">${asciiHeadline}</pre>
            ${data.headlines.length > 0 && data.headlines[0].link ? `<p><a href="${moreLink}" target="_blank">Read more on GitHub →</a></p>` : ''}
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

function createWorkflowCards(data) {
    const cards = data.workflow_cards || [];
    if (!cards.length) return '<p class="note">No workflow cards yet.</p>';

    return '<div class="workflow-grid">' + cards.map(card => {
        const tabs = card.install_methods.map((m, i) => {
            const allLines = [...(m.pre_steps || []), ...m.steps, m.verify_command ? '# Verify\\n' + m.verify_command : ''];
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
                    <pre class="terminal-body"><code>${escapeHtml(allLines.join('\\n'))}</code></pre>
                    <button class="copy-btn" data-copy="${escapeHtml(allLines.join('\\n'))}">Copy all</button>
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
                    <pre class="terminal-body"><code>${escapeHtml((d.steps || []).join('\\n'))}</code></pre>
                    <button class="copy-btn" data-copy="${escapeHtml((d.steps || []).join('\\n'))}">Copy steps</button>
                </div>
            </div>
        `).join('');

        const useCases = (card.use_cases || []).map((u, i) => `
            <div class="use-case">
                <h5>${i + 1}. ${escapeHtml(u.title)}</h5>
                <p class="use-context">${escapeHtml(u.context)}</p>
                <div class="terminal-block">
                    <div class="terminal-header"><span>$</span><span>demo</span></div>
                    <pre class="terminal-body"><code>${escapeHtml((u.demo_commands || []).join('\\n'))}</code></pre>
                    <button class="copy-btn" data-copy="${escapeHtml((u.demo_commands || []).join('\\n'))}">Copy demo</button>
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
        ">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; flex-wrap:wrap;">
                <h3 style="color:#00ffcc; margin:0;">${escapeHtml(wt.title)}</h3>
                <div style="display:flex; gap:8px;">
                    <span style="background:rgba(0,255,0,0.15); color:#00ff00; padding:2px 8px; border-radius:4px; font-size:12px;">${escapeHtml(wt.category)}</span>
                    <span style="background:rgba(255,204,0,0.15); color:#ffcc00; padding:2px 8px; border-radius:4px; font-size:12px;">${escapeHtml(wt.difficulty)}</span>
                </div>
            </div>
            <p style="color:#ccc; line-height:1.6;">${escapeHtml(wt.description)}</p>
            <ol style="color:#00ff00; line-height:1.8; padding-left:20px;">
                ${wt.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
            </ol>
            ${wt.related_links && wt.related_links.length ? `
                <div style="margin-top:15px; padding-top:15px; border-top:1px solid #1a1a1a;">
                    <strong style="color:#888;">Links:</strong>
                    ${wt.related_links.map(link => `<a href="${escapeHtml(link)}" target="_blank" style="color:#00ffff; margin-left:10px;">${escapeHtml(link)}</a>`).join('')}
                </div>
            ` : ''}
        </article>
    `).join('');
}

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

function createAbout(data) {
    const a = data.about || {};
    return `
        <div class="section">
            <h2>🚀 ${escapeHtml(a.title || 'About')}</h2>
            <p style="color:#ccc; line-height:1.8; font-size:16px; margin-bottom:20px;">${escapeHtml(a.description || '')}</p>
            ${a.features && a.features.length ? `
                <div style="margin-bottom:20px;">
                    <h3 style="color:#00ffcc;">Features</h3>
                    <ul style="color:#aaa; line-height:1.8;">${a.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
                </div>
            ` : ''}
            ${a.tech_stack && a.tech_stack.length ? `
                <div style="margin-bottom:20px;">
                    <h3 style="color:#00ffcc;">Tech Stack</h3>
                    <p style="color:#888;">${escapeHtml(a.tech_stack.join(' · '))}</p>
                </div>
            ` : ''}
            ${a.links && Object.keys(a.links).length ? `
                <div>
                    <h3 style="color:#00ffcc;">Links</h3>
                    <ul style="color:#aaa; line-height:1.8;">${Object.entries(a.links).map(([k,v]) => `<li><a href="${escapeHtml(v)}" target="_blank">${escapeHtml(k)}: ${escapeHtml(v)}</a></li>`).join('')}</ul>
                </div>
            ` : ''}
        </div>
    `;
}

function createContact(data) {
    const c = data.contact || {};
    return `
        <div class="section">
            <h2>📧 ${escapeHtml(c.title || 'Contact')}</h2>
            <p class="menu-content" style="color:#ccc; line-height:1.8;">${escapeHtml(c.note || '')}</p>
            <ul class="menu-content">
                ${c.email ? `<li>Email: <a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></li>` : ''}
                ${c.github ? `<li>GitHub: <a href="${escapeHtml(c.github)}" target="_blank">${escapeHtml(c.github)}</a></li>` : ''}
            </ul>
        </div>
    `;
}
