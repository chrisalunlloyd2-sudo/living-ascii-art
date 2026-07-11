#!/usr/bin/env python3
import json
import re
import datetime
from pathlib import Path

# === CONFIG ===
TECH_KEYWORDS = ['computers', 'ai', 'hardware', 'programming', 'software', 'quantum', 'risc-v', 'cyber']
REPOS = [
    {"name": "frontier-ai-dlc", "url": "https://github.com/chrisalunlloyd2-sudo/frontier-ai-dlc", "incomplete": True, "next_issue": "AST tree fragmentation fix"},
    {"name": "moe-gui-architecture", "url": "https://github.com/chrisalunlloyd2-sudo/moe-gui-architecture", "incomplete": True, "next_issue": "GPU kernel integration pending"},
    {"name": "wip-quantum-asm", "url": "https://github.com/chrisalunlloyd2-sudo/wip-quantum-asm", "incomplete": True, "next_issue": "Instruction set validation"},
]

# Simulated self-sent emails (could be loaded from files)
SELF_SENT_EMAILS = [
    {
        "subject": "Work Update - Q3 AI Pipeline",
        "body": "Please review the upcoming deadline for the quantum annealing scheduler. Need to complete core.py by 2026-07-15.\n\nDon't forget the TODO: Add logging to debug.\n\nThis pushes the AST rewrite forward.",
        "date": "2026-07-10T14:00:00Z"
    },
    {
        "subject": "New Project Proposal: Ural Compiler Suite",
        "body": "We should start tracking issues for Ural. Adding items to backlog.\n\nTODO: Initialize project scaffold by 2026-07-15",
        "date": "2026-07-11T09:30:00Z"
    }
]

# === TECH NEWS FETCH (mock) ===
def fetch_tech_news():
    # Mock news feed - in reality we'd use search_api or RSS
    all_news = [
        "Quantum Supremacy Achieved by Google's Sycamore Processor",
        "AI-Powered Code Review Tool Surpasses Human Accuracy",
        "RISC-V Hardware Secures 5 New Funding Rounds",
        "Breakthrough in Neural Net Compression: 3x Smaller Models",
        "Cybersecurity Firm Reports $2B in New Contracts",
        "SpaceX Announces Starship 3.0 with Full Reusability",
        "Microsoft Announces Windows 12: AI-First OS",
        "Ethical AI Guidelines Released by OECD Committee",
        "Silicon Valley Braces for AI Regulation Changes",
        "Open-Source AI Framework Reaches 1M GitHub Stars"
    ]
    
    # Filter by tech keywords
    filtered = [item for item in all_news if any(kw.lower() in item.lower() 
                                                   for kw in TECH_KEYWORDS)]
    
    # Limit to one (single daily headline)
    daily_headline = filtered[0] if filtered else "No recent tech news"
    return filtered[:1]

# === ISSUE ANALYSIS ===
def analyze_incomplete(repos):
    """Identify incomplete items in repos and rank by urgency"""
    urgent = []
    for repo in repos:
        if repo["incomplete"]:
            # Priority: AST issues > pending PRs > TODO items
            urgent.append({
                "repo": repo["name"],
                "priority": "HIGH",
                "issue": repo["next_issue"],
                "reason": "Pending merge or test failure"
            })
    return urgent

# === EMAIL CROSS-CORRELATION ===
def extract_todos_from_emails(emails):
    todos = []
    for email in emails:
        matches = re.findall(r'(TODO|task|reminder|action)\b.*?[\.\n]', email["body"], re.IGNORECASE)
        for match in matches:
            todos.append({
                "source": email["subject"],
                "task": match.strip(),
                "date_hint": email["date"][:10]
            })
    return sorted(todos, key=lambda x: x["date_hint"], reverse=True)[:3]

# === MAIN PIPELINE ===
def build_report():
    data = {
        "date": datetime.datetime.utcnow().isoformat(),
        "headlines": fetch_tech_news(),
        "repos": REPOS,
        "incomplete_tasks": analyze_incomplete(REPOS),
        "email_todos": extract_todos_from_emails(SELF_SENT_EMAILS),
        "next_steps": {}
    }
    
    # Generate next steps for each repo
    for repo in REPOS:
        # Cross-correlate incompletes with next steps
        if repo["incomplete"]:
            repo_issues = analyze_incomplete([repo])
            repo["next_step"] = repo_issues[0]["issue"] if repo_issues else "Complete pending pull requests"
            data["next_steps"][repo["name"]] = repo_issues[0]["issue"]
    
    # Add email-sourced tasks to next_steps
    for todo in data["email_todos"]:
        source = todo["source"]
        task = todo["task"]
        if "<next>" not in task.lower():
            # Auto-generate synthetic next step placeholder
            task += " [auto-generated from email]"
        data["next_steps"][source.lower()] = task
    
    return data

if __name__ == "__main__":
    report = build_report()
    Path("data.json").write_text(json.dumps(report, indent=2))
