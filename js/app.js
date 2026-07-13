// Living ASCII Art - Main orchestrator

function initApp() {
    updatePage();
    setInterval(updatePage, 5 * 60 * 1000); // 5 min
}

async function updatePage() {
    console.log('[ASCII] updatePage starting...');
    try {
        const data = await loadContent();
        console.log('[ASCII] data loaded:', {
            headlines: data.headlines.length,
            repos: data.repos.length,
            walkthroughs: data.walkthroughs.length,
            workflow_cards: data.workflow_cards.length
        });

        renderSection('workflow-cards-content', 'WorkflowCards', createWorkflowCards, data);
        renderSection('daily-flex-content', 'DailyFlex', renderDailyFlex, data);
        renderSection('page-counter-content', 'PageCounter', createPageCounter, data);
        renderSection('live-feed', 'LiveFeed', createLiveFeed, data);

        if (!window.sectionsRendered) {
            renderSection('walkthroughs-content', 'Walkthroughs', createWalkthroughs, data);
            renderSection('forums-content', 'Forums', createForums, data);
            renderSection('about-content', 'About', createAbout, data);
            renderSection('contact-content', 'Contact', createContact, data);

            initForumInteractions();
            window.sectionsRendered = true;
        }

        bindWorkflowTabs();
        bindDailyFlexVote();

        console.log('[ASCII] updatePage complete');
    } catch (err) {
        console.error('[ASCII] updatePage error:', err);
        const feed = document.getElementById('live-feed');
        if (feed) feed.innerHTML += '<pre style="color:#ff4444;">[ERROR] ' + err.message + '</pre>';
    }
}

function renderSection(elementId, name, fn, data) {
    const container = document.getElementById(elementId);
    if (!container) {
        console.warn(`[ASCII] missing container #${elementId}`);
        return;
    }
    const html = safeRender(name, fn, data);
    container.innerHTML = html;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp);
}
