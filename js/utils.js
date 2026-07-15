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
        title: "Aegis Foundry Launchpad",
        tagline: "The first page you open before writing any code.",
        headlines: [{ title: "Tech News Unavailable", link: "#" }],
        repos: [],
        next_steps: [],
        walkthroughs: [],
        forums: { categories: [] },
        about: { title: "About", description: "", features: [], tech_stack: [], links: {} },
        contact: { email: "", github: "", note: "" },
        workflow_cards: [],
        daily_flex: {},
        metrics: { page_views: 0 }
    };
}

function normalizeData(data) {
    if (!data || typeof data !== 'object') return getFallbackData();

    if (!Array.isArray(data.headlines)) data.headlines = [];
    data.headlines = data.headlines.map(h => {
        if (typeof h === 'string') return { title: h, link: '#', source: 'legacy' };
        return h;
    });

    if (!Array.isArray(data.repos)) data.repos = [];
    data.repos = data.repos.map(r => ({
        name: r.name || 'unknown',
        url: r.url || '#',
        next: r.next || r.next_issue || 'No next issue'
    }));

    ['next_steps', 'incomplete_tasks', 'email_updates', 'walkthroughs', 'workflow_cards'].forEach(k => {
        if (!Array.isArray(data[k])) data[k] = [];
    });
    if (!data.daily_flex) data.daily_flex = {};
    if (!data.metrics) data.metrics = { page_views: 0 };
    if (!data.forums) data.forums = { categories: [] };
    if (!data.about) data.about = { title: "About", description: "", features: [], tech_stack: [], links: {} };
    if (!data.contact) data.contact = { email: "", github: "", note: "" };
    if (!data.seo) data.seo = {};
    return data;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function safeRender(name, fn, data) {
    try {
        if (typeof fn !== 'function') throw new Error(`${name} is not a function`);
        return fn(data);
    } catch (err) {
        console.error(`[ASCII] ${name} failed:`, err);
        return `<div style="color:#ff4444;padding:12px;border:1px solid #ff4444;border-radius:4px;"><strong>${name} error:</strong> ${escapeHtml(err.message)}</div>`;
    }
}
