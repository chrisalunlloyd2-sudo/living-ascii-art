// Living ASCII Art - Main orchestrator
// Loads modules in order: utils → ascii → renderers → interactions → app

function initApp() {
    updatePage();
    setInterval(updatePage, 5 * 60 * 1000); // refresh every 5 min
}

async function updatePage() {
    console.log('[ASCII] updatePage starting...');
    try {
        const data = await loadContent();
        console.log('[ASCII] data loaded:', {
            title: data.title,
            headlines: data.headlines.length,
            repos: data.repos.length,
            walkthroughs: data.walkthroughs.length,
            workflow_cards: data.workflow_cards.length,
            daily_flex: data.daily_flex?.type || 'none'
        });

        // Dynamic sections (re-rendered on each refresh)
        renderSection('workflow-cards-content', 'createWorkflowCards', createWorkflowCards, data);
        renderSection('daily-flex-content', 'renderDailyFlex', renderDailyFlex, data);
        renderSection('page-counter-content', 'createPageCounter', createPageCounter, data);
        renderSection('live-feed', 'createLiveFeed', createLiveFeed, data);

        // Static sections (rendered once)
        if (!window.sectionsRendered) {
            renderSection('walkthroughs-content', 'createWalkthroughs', createWalkthroughs, data);
            renderSection('forums-content', 'createForums', createForums, data);
            renderSection('about-content', 'createAbout', createAbout, data);
            renderSection('contact-content', 'createContact', createContact, data);
            initForumInteractions();
            window.sectionsRendered = true;
        }

        // Bind interactive elements after every render
        bindWorkflowTabs();
        bindDailyFlexVote();

        console.log('[ASCII] updatePage complete');
    } catch (err) {
        console.error('[ASCII] updatePage fatal error:', err);
        showGlobalError(err);
    }
}

function renderSection(elementId, functionName, fn, data) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.warn(`[ASCII] missing container #${elementId}`);
        return;
    }
    try {
        if (typeof fn !== 'function') {
            throw new Error(`${functionName} is not a function (check script load order)`);
        }
        const html = fn(data);
        container.innerHTML = html;
    } catch (err) {
        console.error(`[ASCII] ${functionName} failed:`, err);
        container.innerHTML = `
            <div class="render-error" style="
                color: #ff4444;
                border: 1px solid #ff4444;
                padding: 12px 16px;
                border-radius: 6px;
                background: rgba(255, 68, 68, 0.08);
                margin: 10px 0;
            ">
                ⚠️ <strong>${escapeHtml(functionName)}</strong> failed: ${escapeHtml(err.message)}
            </div>`;
    }
}

function showGlobalError(err) {
    const feed = document.getElementById('live-feed');
    const msg = '<pre style="color:#ff4444; padding:12px; border:1px solid #ff4444; border-radius:6px;">[FATAL] ' + escapeHtml(err.message) + '</pre>';
    if (feed) feed.innerHTML += msg;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp);
}
