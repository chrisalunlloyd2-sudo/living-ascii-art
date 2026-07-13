// ASCII Art with Rainbow Wave Effect - No Fading
// Uses CSS animation for continuous rainbow effect

// Load data from data.json
async function loadContent() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return { headlines: [], repos: [], next_steps: [] };
    }
}

// Convert text to ASCII art using a simple block font
function textToAscii(text) {
    // Simple block font mapping (simplified)
    const font = {
        'A': [
            "  ###  ",
            " #   # ",
            "#####  ",
            "#   #  ",
            "#   #  "
        ],
        'B': [
            "####   ",
            "#   #  ",
            "####   ",
            "#   #  ",
            "####   "
        ],
        'C': [
            " ####  ",
            "#      ",
            "#      ",
            "#      ",
            " ####  "
        ],
        'D': [
            "####   ",
            "#   #  ",
            "#   #  ",
            "#   #  ",
            "####   "
        ],
        'E': [
            "#####  ",
            "#      ",
            "####   ",
            "#      ",
            "#####  "
        ],
        'F': [
            "#####  ",
            "#      ",
            "####   ",
            "#      ",
            "#      "
        ],
        'G': [
            " ####  ",
            "#      ",
            "#  ### ",
            "#   #  ",
            " ####  "
        ],
        'H': [
            "#   #  ",
            "#   #  ",
            "#####  ",
            "#   #  ",
            "#   #  "
        ],
        'I': [
            "#####  ",
            "  #    ",
            "  #    ",
            "  #    ",
            "#####  "
        ],
        'J': [
            "#####  ",
            "    #  ",
            "    #  ",
            "#   #  ",
            " ###   "
        ],
        'K': [
            "#   #  ",
            "#  #   ",
            "###    ",
            "#  #   ",
            "#   #  "
        ],
        'L': [
            "#      ",
            "#      ",
            "#      ",
            "#      ",
            "#####  "
        ],
        'M': [
            "#   #  ",
            "# # #  ",
            "# # #  ",
            "#   #  ",
            "#   #  "
        ],
        'N': [
            "#    # ",
            "##   # ",
            "# #  # ",
            "#  # # ",
            "#   ## "
        ],
        'O': [
            " ###   ",
            "#   #  ",
            "#   #  ",
            "#   #  ",
            " ###   "
        ],
        'P': [
            "####   ",
            "#   #  ",
            "####   ",
            "#      ",
            "#      "
        ],
        'Q': [
            " ###   ",
            "#   #  ",
            "#   #  ",
            "#  # # ",
            " ## # "
        ],
        'R': [
            "####   ",
            "#   #  ",
            "####   ",
            "# #    ",
            "#  #   "
        ],
        'S': [
            " ####  ",
            "#      ",
            " ####  ",
            "     # ",
            " ####  "
        ],
        'T': [
            "#####  ",
            "  #    ",
            "  #    ",
            "  #    ",
            "  #    "
        ],
        'U': [
            "#   #  ",
            "#   #  ",
            "#   #  ",
            "#   #  ",
            " ###   "
        ],
        'V': [
            "#   #  ",
            "#   #  ",
            "#   #  ",
            " # #   ",
            "  #    "
        ],
        'W': [
            "#   #  ",
            "#   #  ",
            "# # #  ",
            "# # #  ",
            " # #   "
        ],
        'X': [
            "#   #  ",
            " # #   ",
            "  #    ",
            " # #   ",
            "#   #  "
        ],
        'Y': [
            "#   #  ",
            " # #   ",
            "  #    ",
            "  #    ",
            "  #    "
        ],
        'Z': [
            "#####  ",
            "    #  ",
            "   #   ",
            "  #    ",
            "#####  "
        ],
        '0': [
            " ###   ",
            "#   #  ",
            "#   #  ",
            "#   #  ",
            " ###   "
        ],
        '1': [
            "  #    ",
            " ##    ",
            "  #    ",
            "  #    ",
            " ###   "
        ],
        '2': [
            " ###   ",
            "    #  ",
            " ###   ",
            "#      ",
            "#####  "
        ],
        '3': [
            "#####  ",
            "    #  ",
            " ###   ",
            "    #  ",
            "#####  "
        ],
        '4': [
            "#   #  ",
            "#   #  ",
            "#####  ",
            "    #  ",
            "    #  "
        ],
        '5': [
            "#####  ",
            "#      ",
            "#####  ",
            "    #  ",
            "#####  "
        ],
        '6': [
            " ###   ",
            "#      ",
            "#####  ",
            "#   #  ",
            " ###   "
        ],
        '7': [
            "#####  ",
            "    #  ",
            "   #   ",
            "  #    ",
            "  #    "
        ],
        '8': [
            " ###   ",
            "#   #  ",
            " ###   ",
            "#   #  ",
            " ###   "
        ],
        '9': [
            " ###   ",
            "#   #  ",
            " ###   ",
            "    #  ",
            " ###   "
        ],
        ' ': [
            "       ",
            "       ",
            "       ",
            "       ",
            "       "
        ],
        '\n': [
            "",
            "",
            "",
            "",
            ""
        ]
    };

    const lines = ['', '', '', '', ''];
    for (const char of text.toUpperCase()) {
        const charArt = font[char] || font['?'];
        if (!charArt) continue;
        for (let i = 0; i < 5; i++) {
            lines[i] += charArt[i] + ' ';
        }
    }
    return lines.join('\n');
}

// Create the HTML content
function createContent(data) {
    // Generate ASCII art for current tech headline
    const techHeadline = data.headlines.length > 0 ? data.headlines[0].title : "Tech News Unavailable";
    const asciiHeadline = textToAscii(techHeadline);
    
    // Generate ASCII repos list
    const asciiRepos = data.repos.map((repo, index) => 
        `${index + 1}. ${repo.name}: ${repo.next}`
    ).join('\n');
    
    // Generate next steps
    const asciiSteps = data.next_steps.map((step, index) => 
        `${index + 1}. ${step}`
    ).join('\n');
    
    return `
        <div class="tech-section">
            <h2>🔬 Tech Headline</h2>
            <pre class="ascii-art">${asciiHeadline}</pre>
            ${data.headlines.length > 0 ? `<p><a href="${data.headlines[0].link}" target="_blank">Read more</a></p>` : ''}
        </div>
        
        <div class="repos-section">
            <h2>💻 GitHub Projects</h2>
            <pre class="ascii-art">${asciiRepos}</pre>
        </div>
        
        <div class="steps-section">
            <h2>📋 Next Steps</h2>
            <pre class="ascii-art">${asciiSteps}</pre>
        </div>
        
        <div class="footer">
            <p>Updated: ${new Date(data.timestamp).toLocaleString()}</p>
        </div>
    `;
}

// Main function to update the page
async function updatePage() {
    const data = await loadContent();
    const container = document.getElementById('live-feed');
    if (container) {
        container.innerHTML = createContent(data);
    }
}

// Initialize and set interval for updates
document.addEventListener('DOMContentLoaded', () => {
    updatePage();
    // Update every 5 minutes
    setInterval(updatePage, 5 * 60 * 1000);
});
