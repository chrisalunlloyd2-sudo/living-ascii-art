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
