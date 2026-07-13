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
