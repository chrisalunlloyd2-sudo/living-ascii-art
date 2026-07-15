function createLiveFeed(data) {
    const techHeadline = data.headlines.length > 0 ? data.headlines[0].title : "Tech News Unavailable";
    const asciiHeadline = textToAscii(techHeadline);

    const asciiRepos = data.repos.map((repo, index) =>
        `${index + 1}. ${repo.name}: ${repo.next || 'No next issue'}`
    ).join('\\n');

    const asciiSteps = data.next_steps?.map((step, index) =>
        `${index + 1}. ${step}`
    ).join('\\n') || 'No next steps defined';

    // Read more always points to the user's GitHub (never Wired)
    const moreLink = CONFIG?.github?.profile || 'https://github.com/chrisalunlloyd2-sudo';

    return `
        <div class="tech-section">
            <h2>🔬 Tech Headline</h2>
            <pre class="ascii-art">${asciiHeadline}</pre>
            ${data.headlines.length > 0 && data.headlines[0].link ? `<p><a href="${moreLink}" target="_blank">Read more on GitHub →</a></p>` : ''}
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
            <p>Updated: ${new Date(data.date || data.timestamp || Date.now()).toLocaleString()}</p>
        </div>
    `;
}
