function createPageCounter(data) {
    const views = data.metrics && data.metrics.page_views != null ? data.metrics.page_views : '—';
    return `<div class="page-counter">🧿 Foundry visitors: <strong>${views}</strong> · ${data.metrics.cards_count || 0} workflow cards · last updated ${data.updated_at || '—'}</div>`;
}
