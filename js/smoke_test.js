// Smoke test: verify all renderer functions are defined with correct signatures
const fs = require('fs');
const files = ['utils.js', 'ascii.js', 'renderers.js', 'interactions.js'];
const code = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const required = [
    'loadContent','getFallbackData','normalizeData','escapeHtml','safeRender',
    'textToAscii','generateDailyAsciiArt',
    'createLiveFeed','createWorkflowCards','renderDailyFlex','createPageCounter',
    'createWalkthroughs','createForums','createAbout','createContact',
    'bindWorkflowTabs','bindDailyFlexVote','initForumInteractions'
];
let fail = false;
for (const fn of required) {
    const re = new RegExp(`\\bfunction\\s+${fn}\\s*\\(`);
    if (!re.test(code)) {
        console.error(`MISSING: ${fn}`);
        fail = true;
    }
}
if (!fail) console.log('SMOKE_TEST_OK: all required functions defined');
else process.exit(1);
