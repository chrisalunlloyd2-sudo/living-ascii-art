#!/usr/bin/env python3
import json
import datetime
import os

TECH_KEYWORDS = ['computers', 'ai', 'artificial intelligence', 'hardware', 'programming', 'software', 'tech', 'digital', 'cyber', 'data', 'algorithm', 'chip', 'processor', 'quantum', 'neural']


def load_cached_data():
    tech_news = [
        {"title": "New AI Chip Breaks Energy Efficiency Barriers", "link": "https://www.wired.com/story/new-ai-chip-energy-efficiency/", "source": "Wired"},
        {"title": "Open Source Hardware Revolution Gains Momentum", "link": "https://github.com/opensource-hardware", "source": "GitHub"},
        {"title": "Programming Language X Surges in Developer Adoption", "link": "https://stateofjs.com/2025/", "source": "StateOfJS"},
        {"title": "Quantum Supremacy Achieved by Google's Sycamore Processor", "link": "https://techcrunch.com/2025/03/15/google-quantum-supremacy/", "source": "TechCrunch"},
        {"title": "Data Center Cooling Innovations Cut Power Use by 40%", "link": "https://www.datacenterdynamics.com", "source": "DataCenterDynamics"}
    ]
    filtered_news = [n for n in tech_news if any(kw in n['title'].lower() for kw in TECH_KEYWORDS)]

    repos = [
        {"name": "frontier-ai-dlc", "url": "https://github.com/chrisalunlloyd2-sudo/frontier-ai-dlc", "next": "Fix AST tree fragmentation in src/reset"},
        {"name": "moe-gui-architecture", "url": "https://github.com/chrisalunlloyd2-sudo/moe-gui-architecture", "next": "Integrate wave renderer into foundry dashboard"},
        {"name": "viper-kernel", "url": "https://github.com/chrisalunlloyd2-sudo/viper-kernel", "next": "Complete GPU kernel integration"},
        {"name": "living-ascii-art", "url": "https://github.com/chrisalunlloyd2-sudo/living-ascii-art", "next": "Add more walkthroughs and polish UI"}
    ]

    next_steps = [
        "Resolve AST tree fragmentation in frontier-ai-dlc",
        "Integrate living-ASCII wave renderer into MoeGUI",
        "Complete GPU kernel integration for viper-kernel",
        "Add TODO: logging to debug AI pipeline"
    ]

    incomplete_tasks = [
        "Fix incomplete AST tree in src/reset",
        "Complete instruction set validation for quantum-asm",
        "Resolve memory allocation bug in kernel"
    ]

    email_updates = [
        "TODO: Add logging to debug AI pipeline",
        "Review PR #42 for memory optimization",
        "Follow up on GitHub issue #18"
    ]

    walkthroughs = [
        {
            "id": "openai-manager",
            "title": "OpenAI Manager Setup",
            "category": "AI Tools",
            "difficulty": "Beginner",
            "description": "A complete beginner-friendly guide to setting up the OpenAI Manager for local model orchestration. Covers Node.js installation, cloning the repo, dependency setup, API key management via environment variables, model preference configuration, and launching the local dashboard.",
            "steps": [
                "Install Node.js 18+ and npm from https://nodejs.org/",
                "Clone the repo: `git clone https://github.com/your-repo/openai-manager`",
                "Run `npm install` inside the project folder",
                "Copy `.env.example` to `.env` and add `OPENAI_API_KEY=sk-...`",
                "Configure models in `config/models.json`",
                "Start: `npm run dev`",
                "Open http://localhost:3000"
            ],
            "related_links": [
                "https://platform.openai.com/api-keys",
                "https://github.com/openai/openai-node"
            ]
        },
        {
            "id": "proot-sandbox",
            "title": "Proot Sandbox Management",
            "category": "System Tools",
            "difficulty": "Intermediate",
            "description": "Create and manage isolated Linux sandboxes with Proot for secure development on Android or low-privilege hosts. Covers install, login, toolchain setup, directory binds, and cleanup.",
            "steps": [
                "Install Proot: `pkg install proot proot-distro`",
                "Install Alpine: `proot-distro install alpine`",
                "Login: `proot-distro login alpine`",
                "Install tools: `apk add nodejs python3 git curl vim`",
                "Mount host dirs: `proot --bind /sdcard/Projects:/root/projects -- /bin/sh`",
                "Run isolated builds and tests",
                "Exit with `exit`; remove with `proot-distro remove alpine`"
            ],
            "related_links": [
                "https://github.com/termux/proot-distro",
                "https://wiki.termux.com/wiki/Proot"
            ]
        },
        {
            "id": "gguf-quantization",
            "title": "GGUF v3 Quantization: Q4_0 / Q4_K / Q5_K / Q8_0",
            "category": "Model Optimization",
            "difficulty": "Advanced",
            "description": "Deep dive into GGUF v3 quantization formats: block layouts, bit budgets, accuracy trade-offs, and exact commands to convert to FP16 then quantize to Q4_0, Q4_K_M, Q5_K_M, Q8_0. Includes perplexity benchmarking.",
            "steps": [
                "Install/build llama.cpp",
                "Convert to FP16: `python convert.py --outfile model-f16.gguf`",
                "Q4_0: `llama-quantize model-f16.gguf model-q4_0.gguf Q4_0`",
                "Q4_K_M: `llama-quantize model-f16.gguf model-q4_k.gguf Q4_K_M`",
                "Q5_K_M: `llama-quantize model-f16.gguf model-q5_k.gguf Q5_K_M`",
                "Q8_0: `llama-quantize model-f16.gguf model-q8_0.gguf Q8_0`",
                "Compare perplexity: `llama-perplexity -m model-q4_k.gguf -f wiki.test.raw`",
                "Pick Q4_K_M for balance, Q8_0 for quality, Q4_0 for edge devices"
            ],
            "related_links": [
                "https://github.com/ggerganov/llama.cpp",
                "https://github.com/ggerganov/ggml/blob/master/docs/gguf.md"
            ]
        },
        {
            "id": "code-assist-clis",
            "title": "Install All Code-Assist CLIs in One Place",
            "category": "Developer Workflow",
            "difficulty": "Beginner",
            "description": "One-shot setup for Slack CLI, JetBrains Toolbox, Aider, GitHub CLI, Ollama, ripgrep, fzf, and lazygit. Covers macOS, Linux, and Windows install paths plus useful shell aliases.",
            "steps": [
                "Install a package manager (Homebrew / winget / apt / apk)",
                "Slack CLI: `brew install slackcorp/slack/slack` or see Slack docs",
                "JetBrains Toolbox: download from https://www.jetbrains.com/toolbox-app/",
                "Aider: `pip install aider-install && aider-install`",
                "GitHub CLI: `brew install gh` / `winget install GitHub.cli` / `apt install gh`",
                "Ollama: `curl -fsSL https://ollama.com/install.sh | sh`",
                "Productivity CLIs: `brew install ripgrep fzf lazygit jq`",
                "Verify versions: `slack --version`, `gh --version`, `aider --version`, `ollama --version`",
                "Add aliases: `alias ai='aider'`, `alias lg='lazygit'`, `alias oll='ollama run llama3.1'`"
            ],
            "related_links": [
                "https://api.slack.com/automation/cli",
                "https://www.jetbrains.com/toolbox-app/",
                "https://aider.chat/docs/install.html",
                "https://cli.github.com/",
                "https://ollama.com/"
            ]
        }
    ]

    about = {
        "title": "Aegis Foundry — Living ASCII Dashboard",
        "description": "A sovereign, auto-updating terminal-style dashboard for tracking projects, mastering workflows, and surfacing the most important next steps. Built as a static GitHub Pages site with a Python data generator, rainbow ASCII art, and expandable walkthroughs.",
        "features": [
            "Live ASCII headline renderer with rainbow hue cycling",
            "GitHub project tracker with next-step focus",
            "Curated technical walkthroughs (desktop + terminal + FAQ style)",
            "Forum scaffold with localStorage post persistence",
            "5-minute auto-refresh via GitHub Actions",
            "Cache-busted JS for instant updates"
        ],
        "tech_stack": [
            "GitHub Pages",
            "Vanilla JavaScript",
            "Python 3 data generator",
            "GitHub Actions cron scheduler"
        ],
        "links": {
            "Source code": "https://github.com/chrisalunlloyd2-sudo/living-ascii-art",
            "Walkthroughs guide": "https://github.com/chrisalunlloyd2-sudo/living-ascii-art/blob/main/WALKTHROUGHS.md"
        }
    }

    contact = {
        "title": "Contact",
        "note": "Questions, ideas, or broken walkthroughs? Reach out directly.",
        "email": "chrisalunlloyd2@gmail.com",
        "github": "https://github.com/chrisalunlloyd2-sudo"
    }

    forums = {
        "categories": [
            {"id": "general", "title": "General Discussion", "description": "Open forum for questions, ideas, and project chatter.", "posts": []},
            {"id": "walkthroughs", "title": "Walkthrough Requests", "description": "Suggest new walkthroughs or corrections.", "posts": []},
            {"id": "showcase", "title": "Showcase", "description": "Share things built with these guides.", "posts": []}
        ]
    }

    return {
        "headlines": filtered_news[:3],
        "repos": repos,
        "next_steps": next_steps,
        "incomplete_tasks": incomplete_tasks,
        "email_updates": email_updates,
        "walkthroughs": walkthroughs,
        "about": about,
        "contact": contact,
        "forums": forums,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }


if __name__ == "__main__":
    report = load_cached_data()
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_path = os.path.join(base_dir, "data.json")
    with open(output_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"Data written to {output_path}")
