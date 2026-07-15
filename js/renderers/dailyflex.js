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
