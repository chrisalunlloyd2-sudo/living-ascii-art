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
