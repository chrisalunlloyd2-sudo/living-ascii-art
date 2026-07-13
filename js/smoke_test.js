// CI smoke test: verify all required global functions exist before deploy
const fs = require('fs');
const files = ['config.js', 'utils.js', 'ascii.js', 'renderers.js', 'interactions.js', 'app.js'];
const code = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');

const required = [
    { name: 'CONFIG', pattern: 'const CONFIG' },
    { name: 'loadContent', pattern: 'function loadContent' },
    { name: 'getFallbackData', pattern: 'function getFallbackData' },
    { name: 'normalizeData', pattern: 'function normalizeData' },
    { name: 'escapeHtml', pattern: 'function escapeHtml' },
    { name: 'safeRender', pattern: 'function safeRender' },
    { name: 'textToAscii', pattern: 'function textToAscii' },
    { name: 'generateDailyAsciiArt', pattern: 'function generateDailyAsciiArt' },
    { name: 'createLiveFeed', pattern: 'function createLiveFeed' },
    { name: 'createWorkflowCards', pattern: 'function createWorkflowCards' },
    { name: 'renderDailyFlex', pattern: 'function renderDailyFlex' },
    { name: 'createPageCounter', pattern: 'function createPageCounter' },
    { name: 'createWalkthroughs', pattern: 'function createWalkthroughs' },
    { name: 'createForums', pattern: 'function createForums' },
    { name: 'createAbout', pattern: 'function createAbout' },
    { name: 'createContact', pattern: 'function createContact' },
    { name: 'bindWorkflowTabs', pattern: 'function bindWorkflowTabs' },
    { name: 'bindDailyFlexVote', pattern: 'function bindDailyFlexVote' },
    { name: 'initForumInteractions', pattern: 'function initForumInteractions' },
    { name: 'initApp', pattern: 'function initApp' },
    { name: 'updatePage', pattern: 'function updatePage' },
    { name: 'renderSection', pattern: 'function renderSection' }
];

let fail = false;
for (const item of required) {
    if (!code.includes(item.pattern)) {
        console.error(`MISSING: ${item.name}`);
        fail = true;
    }
}

if (fail) {
    console.error('\nSMOKE TEST FAILED');
    process.exit(1);
}
console.log('SMOKE_TEST_OK: all required symbols found');
