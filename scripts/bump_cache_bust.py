#!/usr/bin/env python3
"""Bump cache-bust query string in index.html using current git short hash."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
index = ROOT / 'index.html'
html = index.read_text(encoding='utf-8')

short_hash = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'], cwd=ROOT).decode().strip()

# Replace any existing ?v=... on our js files with the new hash
new_html = re.sub(
    r'(js/[a-zA-Z0-9_./-]+\.js)\?v=[^"\'\s]+',
    r'\1?v=' + short_hash,
    html
)

if new_html != html:
    index.write_text(new_html, encoding='utf-8')
    print(f'Bumped cache-bust to {short_hash}')
else:
    print(f'Cache-bust already at {short_hash}')
