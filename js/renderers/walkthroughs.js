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
