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
        {"name": "living-ascii-art", "url": "https://github.com/chrisalunlloyd2-sudo/living-ascii-art", "next": "Add 3D wave effects enhancement"}
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
            "description": "Complete guide to setting up OpenAI Manager for local model orchestration, API key management, and cost tracking.",
            "steps": [
                "Install Node.js 18+ and npm",
                "Clone the repo: `git clone https://github.com/your-repo/openai-manager`",
                "Run `npm install` to install dependencies",
                "Copy `.env.example` to `.env` and add your OpenAI API key",
                "Configure model preferences in `config/models.json`",
                "Start the manager: `npm run dev`",
                "Access dashboard at http://localhost:3000"
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
            "description": "Manage isolated Linux sandboxes with Proot for secure development and dependency control.",
            "steps": [
                "Install Proot: `pkg install proot` (Termux) or use your distro's package manager",
                "Create a sandbox: `termux-setup-storage` then `proot-distro install alpine`",
                "Login: `proot-distro login alpine`",
                "Install tools inside sandbox: `apk add nodejs python3 git`",
                "Mount project dirs: `proot --bind /sdcard/Projects:/root/projects`",
                "Run isolated builds and tests inside the sandbox",
                "Exit with `exit` when done"
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
            "description": "Deep dive into GGUF v3 quantization formats, block layouts, bit budgets, and when to use each scheme.",
            "steps": [
                "Install llama.cpp or a quantization tool with GGUF support",
                "Convert your model to FP16 GGUF first: `python convert.py --outfile model-f16.gguf`",
                "Quantize to Q4_0: `llama-quantize model-f16.gguf model-q4_0.gguf Q4_0`",
                "Quantize to Q4_K_M: `llama-quantize model-f16.gguf model-q4_k.gguf Q4_K_M`",
                "Quantize to Q5_K_M: `llama-quantize model-f16.gguf model-q5_k.gguf Q5_K_M`",
                "Quantize to Q8_0: `llama-quantize model-f16.gguf model-q8_0.gguf Q8_0`",
                "Compare perplexity: `llama-perplexity -m model-q4_0.gguf -f wiki.test.raw`",
                "Pick format based on size/quality trade-off (Q4_K_M for balanced, Q8_0 for best quality)"
            ],
            "related_links": [
                "https://github.com/ggerganov/llama.cpp",
                "https://github.com/ggerganov/ggml/blob/master/docs/gguf.md"
            ]
        }
    ]

    return {
        "headlines": filtered_news[:3],
        "repos": repos,
        "next_steps": next_steps,
        "incomplete_tasks": incomplete_tasks,
        "email_updates": email_updates,
        "walkthroughs": walkthroughs,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

if __name__ == "__main__":
    report = load_cached_data()
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_path = os.path.join(base_dir, "data.json")
    with open(output_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"Data written to {output_path}")
